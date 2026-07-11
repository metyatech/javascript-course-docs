from pathlib import Path
p=Path('content/docs/apps/quiz-app-4choice/index.mdx')
a=p.read_text(encoding='utf-8').splitlines()
i=next(i for i,x in enumerate(a) if x.startswith('「もう一度」ボタンは'))
a[i+1:i+1]=['', '`button:disabled` は、`disabled = true` で押せない状態になったボタンだけを指定する疑似クラスです。  ', 'このアプリでは、回答後のボタンを少し薄く表示するために使います。']
i=next(i for i,x in enumerate(a) if x.startswith("`display` に `'block'`"))