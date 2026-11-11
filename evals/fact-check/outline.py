import json,sys,random,re
repo=sys.argv[1]; d=f'/home/user/evalruns/{repo}'
r=random.Random(repo); order=['A','B']; r.shuffle(order)
def plain(s): return re.sub(r'<[^>]+>','',s or '')
out=[]
for lab,v in zip('XY',order):
    m=json.load(open(f'{d}/map{v}.json'))
    out.append(f'## Map {lab}\nComponents:\n'+'\n'.join(f"- {plain(n.get('concept'))} ({plain(n.get('tool'))})" for n in m['nodes'])
      +'\nFlows:\n'+'\n'.join(f"- {plain(f.get('title'))}" for f in m['flows'].values())+'\n')
open(f'{d}/judge-outline.md','w').write('\n'.join(out)); json.dump(dict(zip('XY',order)),open(f'{d}/judge-outline-key.json','w'))
