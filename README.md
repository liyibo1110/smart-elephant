# Smart-Elephant

是一个基于Electron和Vue的本地桌面应用，可独立运行不需要后端，基础功能为可批量操作多个同构数据库，批量建表/删除/截断，对已有表增删字段/索引（目前只支持PostgreSQL）



## 安装依赖

```
npm install

```



### 运行命令

```
npm run electron:serve

```



### 操作说明

1.单个集群内所有主机信息，需要记录在集群表里，结构见代码的database_infos.sql文件。（表名可自定义）

2.集群内的主机维护，在数据库上述表中自行维护信息，没有提供界面功能，主机列表只提供查看。

3.所有操作均要先选择集群，之后的操作针对集群所有机器批量操作。
