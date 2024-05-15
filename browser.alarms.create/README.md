# 问题背景

- 1.firefox popup页面或共享页面打开静置一段时间后，`runtime.connect`连接的`onDisconnect`事件触发，导致页面和背景页失去连接。

- 2.如果打开了扩展调试器，脚本将保持活动状态并显示：

Background event page was not terminated on idle because a DevTools toolbox is attached to the extension.

相关BUG:[Do not terminate background on idle while devtools are attached](https://bugzilla.mozilla.org/show_bug.cgi?id=1748530)

# 原因

firefox 事件页面在空闲时通常会被终止以节省资源。

# 处理

使用 browser.alarms API来创建一个闹钟，定期唤醒服务工作线程以执行一些任务。

每分钟响起一个警报不足以让脚本保持活力。设置了三个闹钟，交错设置，每个闹钟每 20 秒响一次。

```js
browser.alarms.create("keep-loaded-alarm-0", {
    periodInMinutes: 1
});
setTimeout(() => browser.alarms.create("keep-loaded-alarm-1", {
    periodInMinutes: 1
}), "20000");
setTimeout(() => browser.alarms.create("keep-loaded-alarm-2", {
    periodInMinutes: 1
}), "40000");

browser.alarms.onAlarm.addListener(() => {
    console.log("keeping extension alive - log for debug");
});
```

- 参考[How to stop a background script from going idle in MV3?](https://discourse.mozilla.org/t/how-to-stop-a-background-script-from-going-idle-in-mv3/128327)

# alarms.create 接口

## 使用语法

```
browser.alarms.create(
  name, // 可选的字符串 (string) 类型
  alarmInfo, // 可选的对象 (object) 类型
);
```

## alarmInfo参数

- `periodInMinutes`：相当于setInterval,每隔多少分钟执行一次

- `delayInMinutes`：相当于setTimeout,多少分钟后执行

## 注意事项

- 1.使用时需要在`manifest.json`里注册权限[alarms]

- 2.alarms最小时间限制在1分钟,也就是说参数只能大于等于1分钟,小于1分钟则会报错

- 3.alarms使用时需要定义一个name,如果不定义name直接使用的话,第二个alarms会覆盖第一个
