from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import json, math, subprocess, sys
BASE=Path(__file__).resolve().parent
W,H,FPS,DURATION=1920,1080,30,67.5
BG='#252522'; CREAM='#ece3cc'; ORANGE='#dd7e2b'; SAGE='#a5bd8f'; RED='#ff5147'
fonts={}
def font(n=30,bold=False):
 key=(n,bold)
 if key not in fonts: fonts[key]=ImageFont.truetype(str(BASE/'assets'/('Sansita-Bold.ttf' if bold else 'DM-Sans.ttf')),n)
 return fonts[key]
def ease(v):
 v=max(0,min(1,v));return v*v*(3-2*v)
def lerp(a,b,v):return a+(b-a)*v
imgs={}
for p in (BASE/'captures').glob('*.jpg'):
 im=Image.open(p).convert('RGB')
 if im.width!=1920: im=im.resize((1920,round(im.height*1920/im.width)),Image.Resampling.LANCZOS)
 imgs[p.stem]=im
raw=json.loads((BASE/'timings.json').read_text())
words=[w for w in raw['words'] if not w['text'].startswith('[')]
# Connector alignment includes stage directions; captions omit those non-spoken tags.
(BASE/'timings.json').write_text(json.dumps({'text':raw['text'],'words':words},indent=2))
captions=[]; group=[]
for w in words:
 group.append(w)
 txt=' '.join(x['text'] for x in group)
 if len(txt)>67 or w['text'].endswith(('.',':','?','!')) or (len(group)>=5 and w['text'].endswith(',')):
  captions.append((group[0]['start'],group[-1]['end'],txt));group=[]
if group:captions.append((group[0]['start'],group[-1]['end'],' '.join(x['text'] for x in group)))
def stamp(s):
 ms=round(s*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(BASE/'forge-demo.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(a)} --> {stamp(b)}\n{c}' for i,(a,b,c) in enumerate(captions))+'\n')
def center(draw,text,y,f,fill=CREAM,x=960):
 draw.text((x,y),text,font=f,fill=fill,anchor='mt')
def mark(d,x,y,s,alpha=1):
 paths=[[(5,10),(15,10),(24,24),(42,24)],[(5,24),(42,24)],[(5,38),(15,38),(24,24)],[(33,15),(42,24),(33,33)]]
 for p in paths:d.line([(x+a*s/48,y+b*s/48) for a,b in p],fill=ORANGE,width=max(2,int(s*5/48)),joint='curve')
def brand(t,outro=False):
 im=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(im)
 # Quiet geometric guides express several systems converging.
 for y in [290,540,790]:d.line([(0,y),(480,y),(730,540)],fill='#373630',width=2)
 d.line([(1130,540),(1920,540)],fill='#373630',width=2)
 s=190;mark(d,650,355,s)
 d.text((865,350),'Forge',font=font(160,True),fill=CREAM)
 center(d,'ONE CONNECTED OPERATION',600,font(30),SAGE)
 if outro:center(d,'Keep inventory moving. Guesswork parked.',694,font(38))
 else:center(d,'Vending + inventory + better decisions',694,font(34))
 return im
# Each shot uses an authentic browser capture. Crop boxes are x,y,width (16:9).
shots=[
 (1.3,8.85,'dashboard',(0,0,1920),(230,80,1680),'01 / DASHBOARD','Your operation, together'),
 (8.85,12.5,'dashboard',(250,235,1660),(250,245,1660),'01 / DASHBOARD','The numbers that keep work moving'),
 (12.5,15.4,'dashboard-select',(250,95,1660),(280,120,1600),'01 / DASHBOARD','Stock-outs → the station needing attention'),
 (15.4,18,'station-top',(270,320,1640),(310,390,1560),'01 / STOCK-OUT ALERT','One click into station inventory'),
 (18,19.35,'customers',(220,60,1700),(260,90,1640),'02 / CUSTOMERS','Search by name or account code'),
 (19.35,20.45,'customers-code',(260,90,1640),(260,90,1640),'02 / CUSTOMERS','Search by name or account code'),
 (20.45,21.65,'customers-tech',(260,90,1640),(270,110,1620),'02 / CUSTOMERS','Results narrow as you type'),
 (21.65,22.35,'customers-list',(260,90,1640),(260,90,1640),'02 / CUSTOMERS','Grid or list—your call'),
 (22.35,28.35,'customers-tech',(275,190,1250),(285,205,1200),'02 / CUSTOMER CARDS','An account at a glance'),
 (28.35,33.45,'customer-overview',(250,80,1660),(280,90,1600),'03 / CUSTOMER OVERVIEW','A quick read on the whole account'),
 (33.45,35,'stations-full',(270,430,1640),(270,1020,1640),'04 / STATIONS','Scroll through every connected station'),
 (35,40.45,'station-full',(300,550,1570),(310,560,1550),'04 / STATION INVENTORY','Stock, replenishment, and warehouse context'),
 (40.45,42.95,'reorder-selected',(300,285,1550),(490,310,1370),'05 / REPLENISHMENT','Select items. Adjust quantities.'),
 (42.95,44.65,'order-summary',(275,190,1370),(285,200,1350),'05 / ORDER REVIEW','Review the replenishment order summary'),
 (44.65,46.15,'customer-overview',(250,60,1660),(350,70,1560),'06 / MIN/MAX ANALYSIS','Run the analysis'),
 (46.15,49.55,'recommendations',(280,390,1600),(330,420,1540),'06 / MIN/MAX ANALYSIS','Forge proprietary inventory calculations'),
 (58.4,60.05,'machines-auto',(260,100,1650),(280,120,1620),'07 / MACHINE LIBRARY','Your fleet, by machine type'),
 (60.05,62,'machines-crib',(280,120,1620),(290,135,1610),'07 / MACHINE LIBRARY','Every model. Its fleet count.'),
]
def camera(im,box):
 x,y,w=box;h=w*9/16
 return im.crop((x,y,x+w,y+h)).resize((W,H),Image.Resampling.BICUBIC)
def rect(d,box,cam,color=ORANGE,width=4):
 x,y,w=cam;scale=W/w
 a,b,c,e=box;box2=((a-x)*scale,(b-y)*scale,(c-x)*scale,(e-y)*scale)
 d.rounded_rectangle(box2,radius=12,outline=color,width=width)
 return box2
def pointer(d,x,y,t):
 r=18+10*math.sin(t*5)**2
 d.ellipse((x-r,y-r,x+r,y+r),outline=ORANGE,width=3)
 d.polygon([(x,y),(x+5,y+28),(x+12,y+20),(x+22,y+20)],fill=CREAM,outline=BG)
def pill(d,x,y,text,color=ORANGE,size=27):
 f=font(size);bb=d.textbbox((0,0),text,font=f);ww=bb[2]+36
 d.rounded_rectangle((x,y,x+ww,y+48),radius=12,fill=BG,outline=color,width=2)
 d.text((x+18,y+9),text,font=f,fill=color)
def ai(t):
 im=imgs['recommendations'].resize((W,H)).filter(ImageFilter.GaussianBlur(10)).convert('RGBA')
 veil=Image.new('RGBA',(W,H),(25,25,23,224));im=Image.alpha_composite(im,veil).convert('RGB');d=ImageDraw.Draw(im)
 center(d,'Forge calculations. Your choice of AI.',150,font(66,True))
 pill(d,650,250,'PLANNED FOR LIVE INSTALLATIONS',SAGE,27)
 boxes=[(110,365,575,600),(730,365,1195,600),(1350,365,1815,600)]
 titles=[('Real usage','data'),('Forge proprietary','calculations'),('Your preferred','AI model')]
 for i,(b,lines) in enumerate(zip(boxes,titles)):
  d.rounded_rectangle(b,20,fill='#30312c',outline=ORANGE if i==2 else '#747468',width=3)
  center(d,f'0{i+1}',b[1]+30,font(26),ORANGE,x=(b[0]+b[2])/2)
  for j,line in enumerate(lines):center(d,line,b[1]+88+j*49,font(38,True),x=(b[0]+b[2])/2)
 for x in [650,1270]:center(d,'+',450,font(48),ORANGE,x=x)
 labels=['ChatGPT','Claude','Grok','Local models'];times=[51.4,52.9,53.48,54.16]
 for i,lab in enumerate(labels):
  x=460+i*260;active=t>=times[i]
  d.rounded_rectangle((x,660,x+235,724),16,fill=ORANGE if active else '#30312c',outline=ORANGE if active else '#6a6a5d',width=2)
  center(d,lab,674,font(31),BG if active else CREAM,x=x+117)
 if t>=55:
  center(d,'↓',753,font(46),SAGE)
  center(d,'Optimized min/max recommendations',818,font(43,True),SAGE)
 return im

def raw_frame(t):
 if t<1.3 or t>=62: im=brand(t,t>=62);chapter='FORGE / PRODUCT TOUR';title='One connected operation'
 elif 49.55<=t<58.4:im=ai(t);chapter='06 / LIVE INSTALLATION DESIGN';title='Configured to the end user’s preference'
 else:
  shot=next(s for s in shots if s[0]<=t<s[1]);a,b,name,c0,c1,chapter,title=shot
  u=ease((t-a)/(b-a));cam=tuple(lerp(c0[i],c1[i],u) for i in range(3))
  cam=(max(0,min(cam[0],imgs[name].width-cam[2])), max(0,min(cam[1],imgs[name].height-cam[2]*9/16)),cam[2])
  im=camera(imgs[name],cam);d=ImageDraw.Draw(im)
  if 5.2<=t<8.85:rect(d,(310,368,1847,541),cam)
  if 9.0<=t<12.5:
   j=0 if t<9.8 else 1 if t<10.4 else 2 if t<11.4 else 3
   rect(d,(310+389*j,568,682+389*j,722),cam)
  if 12.5<=t<15.4:
   rect(d,(310,240,1847,343),cam,RED)
   if t>13.7:
    x,y,w=cam;pointer(d,(1620-x)*1920/w,(292-y)*1920/w,t)
  if 15.4<=t<18:rect(d,(310,598,1847,681),cam,RED)
  if 18<=t<21.65:rect(d,(326,254,787,302),cam)
  if 22.35<=t<28.35:
   if t<24.6:box=(334,440,794,496);label='Stations + stocked items';col=ORANGE
   elif t<25.64:box=(331,545,460,576);label='Machine manufacturer';col=ORANGE
   elif t<26.28:box=(331,512,490,544);label='Customer location';col=ORANGE
   elif t<27.44:box=(744,365,798,399);label='Pending recommendations';col=ORANGE
   else:box=(666,607,800,644);label='Stock-outs → station';col=RED
   rect(d,box,cam,col);pill(d,1090,420,label,col,27)
  if 29.6<=t<33.45:
   j=0 if t<30.56 else 1 if t<31.36 else 2 if t<32.16 else 3
   rect(d,(310+389*j,246,682+389*j,402),cam,RED if j==2 else ORANGE)
  if 35<=t<40.45:
   if t<35.84:box=(936,677,1018,1070);label='Quantity on hand'
   elif t<36.88:box=(1036,677,1210,1070);label='Min / max targets'
   elif t<37.96:box=(1220,677,1320,1070);label='Package sizes'
   elif t<39.2:box=(1490,677,1610,1070);label='ERP warehouse stock'
   else:box=(1610,677,1836,1070);label='Incoming purchase orders'
   rect(d,box,cam);pill(d,70,840,label)
  if 40.45<=t<42.95:
   rect(d,(1650,522,1816,570),cam)
   x,y,w=cam;pointer(d,(1800-x)*1920/w,(545-y)*1920/w,t)
  if 44.65<=t<46.15:
   rect(d,(1712,130,1848,174),cam)
   x,y,w=cam;pointer(d,(1775-x)*1920/w,(155-y)*1920/w,t)
   pill(d,70,840,'Demo analysis · sample usage',SAGE)
  if 46.15<=t<49.55:
   rect(d,(1190,677,1660,875),cam);pill(d,70,840,'Demo calculations · AI connection planned',SAGE)
  if 58.4<=t<62:
   rect(d,(310,410,1465,625),cam)
 # Editorial chrome: clear chapter, unobtrusive demo label, and synchronized captions.
 d=ImageDraw.Draw(im)
 d.rectangle((0,0,1920,86),fill='#1c1d1a')
 mark(d,32,17,48);d.text((100,15),chapter,font=font(22),fill=ORANGE)
 d.text((100,43),title,font=font(25),fill=CREAM)
 pill(d,1714,18,'DEMO DATA',SAGE,18)
 d.rectangle((0,970,1920,1080),fill='#1c1d1a')
 cap=next((c for a,b,c in captions if a<=t<=b+0.08),'')
 if cap:
  # Wrap at a measured width; preserve readable 34px captions.
  lines=[];line=''
  for word in cap.split():
   test=(line+' '+word).strip()
   if d.textlength(test,font=font(34))>1710:lines.append(line);line=word
   else:line=test
  if line:lines.append(line)
  for k,line in enumerate(lines):center(d,line,989+k*39,font(34))
 d.rectangle((0,1075,1920*min(t/DURATION,1),1080),fill=ORANGE)
 return im

def frame(t):
 starts=[1.3,18,22.35,28.35,33.45,35,40.45,42.95,44.65,46.15,49.55,58.4,60.05,62]
 cut=next((s for s in starts if s<=t<s+0.18),None)
 current=raw_frame(t)
 if cut is not None:return Image.blend(raw_frame(cut-0.001),current,ease((t-cut)/0.18))
 return current

def render():
 cmd=['/opt/homebrew/bin/ffmpeg','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','1920x1080','-framerate',str(FPS),'-i','pipe:0','-i',str(BASE/'narration.mp3'),'-map','0:v','-map','1:a','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-af','loudnorm=I=-16:TP=-1.5:LRA=11,apad','-t',str(DURATION),'-movflags','+faststart',str(BASE/'forge-demo.mp4')]
 with open(BASE/'render.log','w') as log:
  p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=log)
  try:
   for n in range(round(DURATION*FPS)):
    p.stdin.write(frame(n/FPS).tobytes())
    if n%300==0:print(f'Rendered {n/FPS:.0f}/{DURATION}s',flush=True)
  finally:p.stdin.close()
  if p.wait()!=0:raise RuntimeError((BASE/'render.log').read_text()[-2000:])
 print('Render complete',flush=True)
if __name__=='__main__':
 if '--preview' in sys.argv:
  for t in [0.6,7,10,13.7,16.3,20.9,23.6,27.7,30.7,34.5,36.2,39.5,42.1,43.7,45.3,47.7,53.6,56.6,59.2,60.8,64]:frame(t).save(BASE/f'preview-{t}.jpg')
  print('Preview frames saved')
 else:render()
