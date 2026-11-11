import json,subprocess,sys
C='/home/user/Interactive-Map-Builder/plugins/interactive-map/skills/interactive-map/scripts/claims.py'
def load(p): return {c['id']:c['text'] for c in json.loads(subprocess.check_output(['python3',C,p,'--json'],stderr=subprocess.DEVNULL))}
old,new=load(sys.argv[1]),load(sys.argv[2])
ch=[i for i in new if old.get(i)!=new[i]]
gone=[i for i in old if i not in new]
print(','.join(ch)); print(f'{len(ch)} changed/new, {len(gone)} removed', file=sys.stderr)
