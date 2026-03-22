var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,a)=>(a=n==null?{}:e(i(n)),s(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n)),l=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var S=Array.isArray;function C(){}var w={H:null,A:null,T:null,S:null},T=Object.prototype.hasOwnProperty;function E(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function D(e,t){return E(e.type,t,e.props)}function O(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function k(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var A=/\/+/g;function j(e,t){return typeof e==`object`&&e&&e.key!=null?k(``+e.key):t.toString(36)}function M(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(C,C):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function N(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,N(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+j(e,0):a,S(o)?(i=``,c!=null&&(i=c.replace(A,`$&/`)+`/`),N(o,r,i,``,function(e){return e})):o!=null&&(O(o)&&(o=D(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(A,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(S(e))for(var u=0;u<e.length;u++)a=e[u],s=l+j(a,u),c+=N(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+j(a,u++),c+=N(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return N(M(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function P(e,t,n){if(e==null)return e;var r=[],i=0;return N(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function F(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var I=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},L={map:P,forEach:function(e,t,n){P(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return P(e,function(){t++}),t},toArray:function(e){return P(e,function(e){return e})||[]},only:function(e){if(!O(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=L,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=w,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return w.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!T.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return E(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)T.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return E(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=O,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:F}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=w.T,n={};w.T=n;try{var r=e(),i=w.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(C,I)}catch(e){I(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),w.T=t}},e.unstable_useCacheRefresh=function(){return w.H.useCacheRefresh()},e.use=function(e){return w.H.use(e)},e.useActionState=function(e,t,n){return w.H.useActionState(e,t,n)},e.useCallback=function(e,t){return w.H.useCallback(e,t)},e.useContext=function(e){return w.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return w.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return w.H.useEffect(e,t)},e.useEffectEvent=function(e){return w.H.useEffectEvent(e)},e.useId=function(){return w.H.useId()},e.useImperativeHandle=function(e,t,n){return w.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return w.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return w.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return w.H.useMemo(e,t)},e.useOptimistic=function(e,t){return w.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return w.H.useReducer(e,t,n)},e.useRef=function(e){return w.H.useRef(e)},e.useState=function(e){return w.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return w.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return w.H.useTransition()},e.version=`19.2.4`})),u=o(((e,t)=>{t.exports=l()})),d=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},f=(e=>e?d(e):d),p=c(u(),1),m=e=>e;function h(e,t=m){let n=p.useSyncExternalStore(e.subscribe,p.useCallback(()=>t(e.getState()),[e,t]),p.useCallback(()=>t(e.getInitialState()),[e,t]));return p.useDebugValue(n),n}var g=e=>{let t=f(e),n=e=>h(t,e);return Object.assign(n,t),n},_=(e=>e?g(e):g),v=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),y=e=>e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase(),b=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,n)=>n?n.toUpperCase():t.toLowerCase()),x=e=>{let t=b(e);return t.charAt(0).toUpperCase()+t.slice(1)},S={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,strokeLinecap:`round`,strokeLinejoin:`round`},C=e=>{for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0;return!1},w=(0,p.forwardRef)(({color:e=`currentColor`,size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:i=``,children:a,iconNode:o,...s},c)=>(0,p.createElement)(`svg`,{ref:c,...S,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:v(`lucide`,i),...!a&&!C(s)&&{"aria-hidden":`true`},...s},[...o.map(([e,t])=>(0,p.createElement)(e,t)),...Array.isArray(a)?a:[a]])),T=(e,t)=>{let n=(0,p.forwardRef)(({className:n,...r},i)=>(0,p.createElement)(w,{ref:i,iconNode:t,className:v(`lucide-${y(x(e))}`,`lucide-${e}`,n),...r}));return n.displayName=x(e),n},E=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),D=o(((e,t)=>{t.exports=E()})),O=864e5,k=Date.now(),A=[{id:`col-ai`,name:`AI与机器学习`,description:`人工智能、深度学习、大模型相关知识`,icon:`🤖`,color:`#6366F1`,createdAt:k-30*O},{id:`col-product`,name:`产品设计`,description:`产品思维、用户体验、交互设计`,icon:`🎨`,color:`#EC4899`,createdAt:k-25*O},{id:`col-tech`,name:`技术架构`,description:`系统设计、前后端技术、数据库`,icon:`⚙️`,color:`#10B981`,createdAt:k-20*O},{id:`col-growth`,name:`个人成长`,description:`职业发展、学习方法、思维模型`,icon:`🌱`,color:`#F59E0B`,createdAt:k-15*O},{id:`col-reading`,name:`阅读笔记`,description:`读书心得与摘录`,icon:`📖`,color:`#8B5CF6`,createdAt:k-10*O}],j=[{id:`card-1`,title:`Transformer架构详解：从Attention到GPT`,content:`Transformer是一种基于自注意力机制的神经网络架构，由Google在2017年提出。它彻底改变了自然语言处理领域，成为GPT、BERT等大模型的基础。核心创新在于多头自注意力机制（Multi-Head Self-Attention），允许模型在处理序列数据时同时关注不同位置的信息。

关键组件包括：
1. 位置编码（Positional Encoding）
2. 多头注意力层
3. 前馈神经网络
4. 残差连接与层归一化

Transformer的优势在于可以并行计算，训练效率远超RNN和LSTM。`,summary:`Transformer是基于自注意力机制的神经网络架构，核心创新是多头注意力机制，是GPT等大模型的基础。`,tags:[`AI`,`深度学习`,`Transformer`,`大模型`],collectionId:`col-ai`,source:`https://arxiv.org/abs/1706.03762`,sourceType:`url`,privacyLevel:`public`,personalNote:`这是理解大模型的基础论文，需要反复阅读`,createdAt:k-28*O,updatedAt:k-28*O,reviewCount:5,nextReviewAt:k-2*O,isFavorite:!0},{id:`card-2`,title:`推荐系统冷启动问题的解决方案`,content:`推荐系统冷启动是指新用户或新物品缺乏交互数据时，系统无法提供有效推荐的问题。主要分为三类：

用户冷启动：新注册用户没有历史行为数据
- 解决方案：利用用户注册信息、引导问卷、热门推荐

物品冷启动：新上架商品没有被评分或点击
- 解决方案：利用物品属性特征、内容分析、专家标注

系统冷启动：整个推荐系统刚上线
- 解决方案：迁移学习、利用外部数据源、基于规则的初始推荐

最新研究方向：大模型增强推荐、跨域推荐、元学习方法。`,summary:`推荐系统冷启动分为用户、物品、系统三类，可通过特征利用、迁移学习、大模型增强等方法解决。`,tags:[`推荐系统`,`AI`,`算法`,`机器学习`],collectionId:`col-ai`,source:``,sourceType:`note`,privacyLevel:`public`,personalNote:`面试高频题，结合美团的实际场景思考`,createdAt:k-22*O,updatedAt:k-20*O,reviewCount:3,nextReviewAt:k+1*O,isFavorite:!0},{id:`card-3`,title:`用户体验设计的五个层次模型`,content:`Jesse James Garrett提出的用户体验五层模型，从抽象到具体：

1. 战略层（Strategy）：产品目标与用户需求
   - 我们要通过这个产品得到什么？
   - 用户想从中获得什么？

2. 范围层（Scope）：功能规格与内容需求
   - 需要开发哪些功能？
   - 需要提供哪些内容？

3. 结构层（Structure）：交互设计与信息架构
   - 各功能如何组织？
   - 导航如何设计？

4. 框架层（Skeleton）：界面设计、导航设计、信息设计
   - 按钮放在哪里？
   - 信息如何呈现？

5. 表现层（Surface）：视觉设计
   - 最终的视觉效果`,summary:`用户体验五层模型从战略层到表现层，提供了系统化思考产品设计的框架。`,tags:[`产品设计`,`用户体验`,`UX`,`设计思维`],collectionId:`col-product`,source:`https://book.douban.com/subject/4723970/`,sourceType:`url`,privacyLevel:`public`,personalNote:``,createdAt:k-18*O,updatedAt:k-18*O,reviewCount:2,nextReviewAt:k+3*O,isFavorite:!1},{id:`card-4`,title:`React 18 并发特性详解`,content:`React 18引入了并发渲染（Concurrent Rendering）机制，这是React架构的重大变革。

核心概念：
- Concurrent Mode：允许React在渲染过程中暂停、恢复和放弃渲染
- Automatic Batching：自动批处理多个状态更新
- Transitions：区分紧急更新和非紧急更新

新API：
- useTransition：标记非紧急状态更新
- useDeferredValue：延迟计算值
- Suspense改进：支持SSR streaming

实践建议：
1. 大列表渲染使用useDeferredValue
2. 搜索场景使用useTransition
3. 数据加载使用Suspense`,summary:`React 18引入并发渲染，包含自动批处理、Transitions等特性，显著提升大型应用的用户体验。`,tags:[`React`,`前端`,`JavaScript`,`性能优化`],collectionId:`col-tech`,source:`https://react.dev/blog/2022/03/29/react-v18`,sourceType:`url`,privacyLevel:`public`,personalNote:`项目中可以用useTransition优化搜索体验`,createdAt:k-15*O,updatedAt:k-14*O,reviewCount:4,nextReviewAt:k-1*O,isFavorite:!0},{id:`card-5`,title:`分布式系统CAP定理的实际应用`,content:`CAP定理指出分布式系统不可能同时满足以下三个条件：

- Consistency（一致性）：所有节点在同一时间看到的数据一致
- Availability（可用性）：每个请求都能收到响应
- Partition Tolerance（分区容错）：系统在网络分区时仍能运作

实际应用中的选择：
- CP系统（放弃可用性）：ZooKeeper, HBase, MongoDB
- AP系统（放弃一致性）：Cassandra, DynamoDB, CouchDB
- CA系统（放弃分区容错）：传统单机数据库

现代实践：大多选择AP + 最终一致性，通过消息队列、事件溯源等方式补偿。`,summary:`CAP定理描述分布式系统中一致性、可用性、分区容错不可兼得，实践中多选AP+最终一致性。`,tags:[`系统架构`,`分布式系统`,`后端`,`数据库`],collectionId:`col-tech`,source:``,sourceType:`text`,privacyLevel:`public`,personalNote:`系统设计面试必考内容`,createdAt:k-12*O,updatedAt:k-12*O,reviewCount:1,nextReviewAt:k+2*O,isFavorite:!1},{id:`card-6`,title:`如何建立个人知识管理体系`,content:`高效的知识管理体系包含四个环节：

1. 信息获取（Input）
   - 建立高质量信息源：RSS、Newsletter、行业大牛
   - 控制信息摄入量，避免信息过载

2. 知识加工（Process）
   - 费曼学习法：能用简单语言解释说明你理解了
   - 做笔记时加入自己的思考和关联

3. 知识存储（Store）
   - 建立分类体系，但不要过度分类
   - 善用标签实现交叉索引

4. 知识输出（Output）
   - 写博客、做分享是最好的学习方式
   - 定期回顾，形成知识网络

工具只是辅助，关键在于建立习惯和流程。`,summary:`知识管理体系包含获取、加工、存储、输出四个环节，工具辅助但关键在于习惯和流程。`,tags:[`学习方法`,`知识管理`,`个人成长`,`效率`],collectionId:`col-growth`,source:``,sourceType:`note`,privacyLevel:`public`,personalNote:`就是我现在在做的事情！`,createdAt:k-10*O,updatedAt:k-8*O,reviewCount:6,nextReviewAt:k-3*O,isFavorite:!0},{id:`card-7`,title:`《思考，快与慢》核心要点`,content:`丹尼尔·卡尼曼的经典著作，提出人类思维的双系统理论：

系统1（快思考）：
- 自动化、无意识、快速
- 基于直觉和经验
- 容易受认知偏差影响

系统2（慢思考）：
- 需要注意力、有意识、缓慢
- 逻辑推理和深度分析
- 消耗认知资源

重要认知偏差：
- 锚定效应：第一个数字影响后续判断
- 可得性偏差：容易想到的事件被认为更频繁
- 损失厌恶：失去100元的痛苦大于得到100元的快乐
- 确认偏差：只关注支持自己观点的信息

对产品设计的启示：利用系统1做好默认选项设计，用系统2引导重要决策。`,summary:`双系统理论区分快思考与慢思考，理解认知偏差对产品设计和决策有重要指导意义。`,tags:[`阅读`,`心理学`,`认知科学`,`产品设计`],collectionId:`col-reading`,source:`https://book.douban.com/subject/10785583/`,sourceType:`url`,privacyLevel:`public`,personalNote:`锚定效应在定价策略中非常实用`,createdAt:k-7*O,updatedAt:k-7*O,reviewCount:2,nextReviewAt:k+5*O,isFavorite:!1},{id:`card-8`,title:`Prompt Engineering最佳实践`,content:`大模型提示词工程的核心技巧：

1. 角色设定（Role）：给模型设定明确角色
   "你是一位资深的产品经理..."

2. 任务描述（Task）：清晰说明要做什么
   "请分析这段用户反馈，提取关键痛点"

3. 格式要求（Format）：指定输出格式
   "请以表格形式输出，包含：痛点、频率、严重程度"

4. 示例引导（Few-shot）：提供输入输出示例

5. 思维链（Chain-of-Thought）：引导模型逐步推理
   "请一步步分析..."

6. 约束条件（Constraints）：设定边界和限制

高级技巧：
- 分解复杂任务为多个简单步骤
- 让模型先输出推理过程再给结论
- 使用温度参数控制创造性`,summary:`提示词工程核心包括角色设定、任务描述、格式要求、示例引导、思维链和约束条件六大技巧。`,tags:[`AI`,`大模型`,`Prompt Engineering`,`效率`],collectionId:`col-ai`,source:``,sourceType:`text`,privacyLevel:`public`,personalNote:`日常工作中每天都在用，持续积累好的prompt模板`,createdAt:k-5*O,updatedAt:k-4*O,reviewCount:3,nextReviewAt:k+1*O,isFavorite:!0},{id:`card-9`,title:`B端产品设计与C端的核心差异`,content:`B端和C端产品在设计理念上有本质差异：

决策链路：
- C端：个人决策，冲动消费
- B端：多角色参与，理性决策，采购流程长

核心指标：
- C端：DAU、留存率、转化率
- B端：续约率、NPS、人效提升

设计原则：
- C端：降低门槛、追求极致体验、病毒传播
- B端：效率优先、专业可靠、数据驱动

功能特点：
- B端需要：权限管理、审批流、数据报表、API集成
- B端避免：过度炫酷的动画、信息过载

关键认知：B端产品的护城河在于对业务场景的深度理解，而非技术花样。`,summary:`B端产品以效率和业务深度为核心，与C端在决策链路、指标和设计原则上有本质差异。`,tags:[`产品设计`,`B端`,`用户体验`,`商业`],collectionId:`col-product`,source:``,sourceType:`note`,privacyLevel:`public`,personalNote:``,createdAt:k-3*O,updatedAt:k-3*O,reviewCount:1,nextReviewAt:k+4*O,isFavorite:!1},{id:`card-10`,title:`个人服务器配置备忘录`,content:`服务器信息：
IP: 192.168.1.100
用户名: admin
密码: MyS3cur3P@ss!
SSH端口: 22

数据库：
MySQL root密码: db_root_2024!
Redis密码: redis_pass_abc

API密钥：
OpenAI API Key: sk-abc123def456
阿里云AccessKey: LTAI5t1234567890`,summary:`个人服务器和各服务的配置信息备忘。`,tags:[`服务器`,`配置`,`运维`],collectionId:`col-tech`,source:``,sourceType:`note`,privacyLevel:`secret`,personalNote:``,createdAt:k-1*O,updatedAt:k-1*O,reviewCount:0,nextReviewAt:k+30*O,isFavorite:!1}],M=[{id:`log-1`,action:`ai_summarize`,cardId:`card-1`,cardTitle:`Transformer架构详解`,timestamp:k-28*O,detail:`AI为知识卡片生成了摘要`},{id:`log-2`,action:`ai_tag`,cardId:`card-1`,cardTitle:`Transformer架构详解`,timestamp:k-28*O,detail:`AI自动生成了标签：AI, 深度学习, Transformer, 大模型`},{id:`log-3`,action:`ai_read`,cardId:`card-2`,cardTitle:`推荐系统冷启动问题`,timestamp:k-22*O,detail:`AI读取内容以生成摘要和标签`},{id:`log-4`,action:`privacy_change`,cardId:`card-10`,cardTitle:`个人服务器配置备忘录`,timestamp:k-1*O,detail:`用户将隐私级别从"公开"更改为"机密"，AI已停止访问此内容`},{id:`log-5`,action:`ai_summarize`,cardId:`card-8`,cardTitle:`Prompt Engineering最佳实践`,timestamp:k-5*O,detail:`AI为知识卡片生成了摘要`},{id:`log-6`,action:`user_modify`,cardId:`card-6`,cardTitle:`如何建立个人知识管理体系`,timestamp:k-8*O,detail:`用户添加了个人批注`}];function N(){let e={};for(let t=0;t<180;t++){let n=new Date(k-t*O).toISOString().slice(0,10);Math.random()>.4&&(e[n]=Math.floor(Math.random()*6)+1)}return e}var P=`zhizhi_kb_`;function F(e,t){try{let n=JSON.stringify(t);localStorage.setItem(P+e,n)}catch{console.warn(`Failed to save to localStorage:`,e)}}function I(e,t){try{let n=localStorage.getItem(P+e);return n===null?t:JSON.parse(n)}catch{return t}}function L(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}var R=[1,3,7,14,30,60],z=864e5;function B(e){let t=Math.min(e,R.length-1);return Date.now()+R[t]*z}var V=_((e,t)=>({cards:I(`cards`,j),collections:I(`collections`,A),auditLogs:I(`auditLogs`,M),privacyPreferences:I(`privacyPrefs`,[]),addCard:t=>{let n={...t,id:L(),createdAt:Date.now(),updatedAt:Date.now(),reviewCount:0,nextReviewAt:Date.now()+z};return e(e=>{let t=[n,...e.cards];return F(`cards`,t),{cards:t}}),n},updateCard:(t,n)=>{e(e=>{let r=e.cards.map(e=>e.id===t?{...e,...n,updatedAt:Date.now()}:e);return F(`cards`,r),{cards:r}})},deleteCard:t=>{e(e=>{let n=e.cards.find(e=>e.id===t),r=e.cards.filter(e=>e.id!==t);if(F(`cards`,r),n){let i=[{id:L(),action:`user_delete`,cardId:t,cardTitle:n.title,timestamp:Date.now(),detail:`用户删除了知识卡片「${n.title}」`},...e.auditLogs];return F(`auditLogs`,i),{cards:r,auditLogs:i}}return{cards:r}})},toggleFavorite:t=>{e(e=>{let n=e.cards.map(e=>e.id===t?{...e,isFavorite:!e.isFavorite}:e);return F(`cards`,n),{cards:n}})},markReviewed:t=>{e(e=>{let n=e.cards.map(e=>{if(e.id!==t)return e;let n=e.reviewCount+1;return{...e,reviewCount:n,nextReviewAt:B(n)}});return F(`cards`,n),{cards:n}})},addCollection:t=>{e(e=>{let n=[...e.collections,{...t,id:L(),createdAt:Date.now()}];return F(`collections`,n),{collections:n}})},updateCollection:(t,n)=>{e(e=>{let r=e.collections.map(e=>e.id===t?{...e,...n}:e);return F(`collections`,r),{collections:r}})},deleteCollection:t=>{e(e=>{let n=e.collections.filter(e=>e.id!==t),r=e.cards.map(e=>e.collectionId===t?{...e,collectionId:null}:e);return F(`collections`,n),F(`cards`,r),{collections:n,cards:r}})},addAuditLog:t=>{e(e=>{let n=[{...t,id:L(),timestamp:Date.now()},...e.auditLogs];return F(`auditLogs`,n),{auditLogs:n}})},clearAuditLogs:()=>{e(()=>(F(`auditLogs`,[]),{auditLogs:[]}))},setPrivacyPreference:t=>{e(e=>{let n=[...e.privacyPreferences.filter(e=>e.type!==t.type),t];return F(`privacyPrefs`,n),{privacyPreferences:n}})},getPrivacyPreference:e=>t().privacyPreferences.find(t=>t.type===e&&t.remembered),importData:n=>{let r=t(),i=new Set(r.cards.map(e=>e.id)),a=new Set(r.collections.map(e=>e.id)),o=(n.cards||[]).filter(e=>!i.has(e.id)),s=(n.collections||[]).filter(e=>!a.has(e.id));return(o.length>0||s.length>0)&&e(e=>{let t=[...o,...e.cards],n=[...e.collections,...s];return F(`cards`,t),F(`collections`,n),{cards:t,collections:n}}),{cardsAdded:o.length,collectionsAdded:s.length}},batchDeleteCards:t=>{e(e=>{let n=new Set(t),r=e.cards.filter(e=>n.has(e.id)),i=e.cards.filter(e=>!n.has(e.id));F(`cards`,i);let a=[...r.map(e=>({id:L(),action:`user_delete`,cardId:e.id,cardTitle:e.title,timestamp:Date.now(),detail:`批量删除了知识卡片「${e.title}」`})),...e.auditLogs];return F(`auditLogs`,a),{cards:i,auditLogs:a}})},batchUpdatePrivacy:(t,n)=>{e(e=>{let r=new Set(t),i=e.cards.map(e=>r.has(e.id)?{...e,privacyLevel:n,updatedAt:Date.now()}:e);return F(`cards`,i),{cards:i}})},batchMoveCollection:(t,n)=>{e(e=>{let r=new Set(t),i=e.cards.map(e=>r.has(e.id)?{...e,collectionId:n,updatedAt:Date.now()}:e);return F(`cards`,i),{cards:i}})},getAllTags:()=>{let e=new Map;return t().cards.forEach(t=>t.tags.forEach(t=>e.set(t,(e.get(t)||0)+1))),Array.from(e.entries()).map(([e,t])=>({name:e,count:t})).sort((e,t)=>t.count-e.count)},getCardsByCollection:e=>t().cards.filter(t=>t.collectionId===e),searchCards:e=>{let n=e.toLowerCase();return t().cards.filter(e=>e.privacyLevel!==`secret`&&(e.title.toLowerCase().includes(n)||e.summary.toLowerCase().includes(n)||e.content.toLowerCase().includes(n)||e.tags.some(e=>e.toLowerCase().includes(n))||e.personalNote.toLowerCase().includes(n)))}}));export{_ as a,c,T as i,N as n,u as o,D as r,o as s,V as t};