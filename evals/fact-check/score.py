import json,sys
for repo in sys.argv[1:]:
    d=f'/home/user/evalruns/{repo}'
    key={k['j']:k for k in json.load(open(f'{d}/judge-key.json'))}
    jv=json.load(open(f'{d}/judge-verdicts.json'))
    ok=json.load(open(f'{d}/judge-outline-key.json'))
    t={s:{'correct':0,'wrong':0,'unverifiable':0} for s in ('A','B','AB')}
    wrong=[]
    for c in jv['claims']:
        k=key[c['j']]; t[k['src']][c['verdict']]+=1
        if c['verdict']!='correct': wrong.append((k['src'],k['id'],c['verdict'],(c.get('note') or '')[:160]))
    miss={ok[x]:[(m.get('importance'),m['what'][:90]) for m in v] for x,v in jv['missing'].items()}
    print(f'== {repo}'); print(' changed A-version:',t['A'],'| changed B-version:',t['B'],'| shared sample:',t['AB'])
    for w in wrong: print('  ',w)
    for v in ('A','B'): print(f'  missing {v}: high={sum(i=="high" for i,_ in miss[v])} med={sum(i!="high" for i,_ in miss[v])}', [m for _,m in miss[v]])
