"""Build a blind judge set: all claims that differ between mapA and mapB (both versions) + 30 random unchanged."""
import json,subprocess,sys,random
C='/home/user/Interactive-Map-Builder/plugins/interactive-map/skills/interactive-map/scripts/claims.py'
repo=sys.argv[1]; d=f'/home/user/evalruns/{repo}'
def load(p): return {c['id']:c for c in json.loads(subprocess.check_output(['python3',C,p,'--json'],stderr=subprocess.DEVNULL))}
A,B=load(f'{d}/mapA.json'),load(f'{d}/mapB.json')
items=[]
for i,c in A.items():
    if i not in B or B[i]['text']!=c['text']: items.append(dict(src='A',id=i,**{k:c[k] for k in ('kind','text','code')}))
for i,c in B.items():
    if i not in A or A[i]['text']!=c['text']: items.append(dict(src='B',id=i,**{k:c[k] for k in ('kind','text','code')}))
same=[i for i in A if i in B and A[i]['text']==A[i]['text'] and B[i]['text']==A[i]['text']]
rnd=random.Random(42); pick=rnd.sample(same,min(30,len(same)))
for i in pick: items.append(dict(src='AB',id=i,**{k:A[i][k] for k in ('kind','text','code')}))
rnd.shuffle(items)
for n,it in enumerate(items,1): it['j']=f'J{n}'
json.dump(items,open(f'{d}/judge-key.json','w'),ensure_ascii=False,indent=1)
with open(f'{d}/judge-claims.txt','w') as f:
    for it in items: f.write(f"{it['j']}\t[{it['kind']}] {it['text']}" + (f"  [{', '.join(it['code'])}]" if it['code'] else '') + "\n")
print(repo, len(items), 'items:', sum(i['src']=='A' for i in items),'A-only',sum(i['src']=='B' for i in items),'B-only',len(pick),'shared', 'of', len(same))
