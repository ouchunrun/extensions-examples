
## CSDN未登录禁止复制的解决办法

```
(function () {
    function setAllSelect(el = document.body) {
        for (let index = 0; index < el.children.length; index++) {
            const e = el.children.item(index);
            e.style.userSelect = 'text';
            setAllSelect(e);
        }
    }
    setAllSelect();
    document.documentElement.addEventListener('mouseup', e => {
        const pasteText = window.getSelection().toString();
        if (null === pasteText || undefined === pasteText || '' === pasteText.trim()) {
            return;
        }
        navigator.clipboard.writeText(pasteText).then(() => {
            alert("复制成功！");
        }).catch(() => {
            alert("复制失败！");
        });
    });
})();
```
