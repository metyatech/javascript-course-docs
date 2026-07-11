from pathlib import Path
p=Path('content/docs/apps/quiz-app-4choice/index.mdx');s=p.read_text();x="`display` に `'block'` を入れると表示され、`'none'` を入れると非表示になります。";y="`display` に `'none'` を入れると非表示になります。このアプリでは、選択肢エリアと操作ボタンをブロック表示にしているため、再表示するときは `'block'` を入れます。";p.write_text(s.replace(x,y))
