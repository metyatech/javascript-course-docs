from pathlib import Path
p=Path('content/docs/apps/quiz-app-4choice/index.mdx');s=p.read_text();x='「もう一度」ボタンは、最初は `display: none` で非表示にします。';y=x+'\n\n`button:disabled` は、`disabled = true` で押せない状態になったボタンだけを指定する疑似クラスです。  \nこのアプリでは、回答後のボタンを少し薄く表示するために使います。';p.write_text(s.replace(x,y))
