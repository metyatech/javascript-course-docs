from pathlib import Path
p=Path('content/docs/apps/quiz-app-4choice/index.mdx')
s=p.read_text(encoding='utf-8')
a="CSSでは、4つの選択肢ボタンを `display: block` で縦に並べます。  \n「もう一度」ボタンは、最初は `display: none` で非表示にします。"
b=a+"\n\n`button:disabled` は、`disabled = true` で押せない状態になったボタンだけを指定する疑似クラスです。  \nこのアプリでは、回答後のボタンを少し薄く表示するために使います。"
c="`display` に `'block'` を入れると表示され、`'none'` を入れると非表示になります。"
d="`display` に `'none'` を入れると非表示になります。このアプリでは、選