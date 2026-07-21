import re
with open('index.html', encoding='utf-8') as f:
    lines = f.read().split('\n')
ind = 0
for i, l in enumerate(lines):
    opens = len(re.findall(r'<div', l, re.IGNORECASE))
    closes = len(re.findall(r'</div', l, re.IGNORECASE))
    ind += opens
    if 'id="page-' in l or '<footer' in l:
        print(f'{i}: {l.strip()} [Opens: {opens}, Closes: {closes}, Total Indent AFTER opens: {ind}]')
    ind -= closes
