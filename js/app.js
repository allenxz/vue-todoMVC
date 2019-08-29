(function (Vue) { //表示依赖了全局的Vue
	const items = [{
			id: 1, //	主键ID
			content: "vue.js", //输入的内容
			completed: false, //是否完成
		},
		{
			id: 2, //	主键ID
			content: "css", //输入的内容
			completed: false, //是否完成
		},
		{
			id: 3, //	主键ID
			content: "python", //输入的内容
			completed: false, //是否完成
		}
	]

	const STORAGE_KEY = "items-vuejs"

	//进行本地保存和读取数据
	const itemStorage = {
		//获取数据
		fetch: function() {
			return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]') 
		},
		//保存数据
		save: function(items) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
		}
	}

	//注册全局自定义指令
	Vue.directive("app-focus", {
		inserted(el, binding) {
			//获取焦点
			el.focus()
		},
		update(el, binding) {
			if (binding.value) {
				el.focus()
			}
		}
	})
	var app = new Vue({
		el: "#todoapp",
		data: { 
			items:itemStorage.fetch(),
			currentItem: null,
			filterStatus: 'all'
		},
		watch: {
			// 监听任务项，用于数据本地持久化
			// deep:true深度监听对象内部属性
			items:{
				deep:true,
				handler(newItems,oldItems){
					itemStorage.save(newItems)
				}
			}
		},
		computed: {
			//根据不同的状态过滤不同的数据
			filterItems() {
				switch (this.filterStatus) {
					case "active":
						return this.items.filter(item => !item.completed)
						break
					case "completed":
						return this.items.filter(item => item.completed)
						break
					default:
						return this.items
						break
				}
			},
			//双向绑定全选框和任务列表的状态
			toggleAll: {
				get() {
					return this.remaining === 0
				},
				//要利用传入的newState
				set(newState) {
					this.items.forEach((item) => {
						item.completed = newState
					})
				}
			},
			//剩余未完成任务数
			remaining() {
				const unItems = this.items.filter(item => !item.completed)
				return unItems.length
			}
		},
		methods: {
			//完成编辑，保存数据后退出
			finishEdit(item, event) {
				const content = event.target.value.trim();
				if (!content.length) {
					this.removeItem(item)
					return
				}
				item.content = content
				this.currentItem = null
			},
			//退出编辑状态
			cancelEdit() {
				this.currentItem = null
			},
			//进入编辑任务项状态
			toEdit(item) {
				this.currentItem = item
			},
			//移除所有已完成任务
			removeCompleted() {
				const unItems = this.items.filter(item => !item.completed)
				this.items = unItems
			},
			//添加任务
			addItem(event) {
				const content = event.target.value.trim()
				if (!content.length) {
					return
				} else {
					const id = this.items.length + 1
					this.items.push({
						id,
						content,
						completed: false,
					})
					event.target.value = ''
				}
			},
			//移除任务
			removeItem(item) {
				//视频里的方法，单纯的传入index来进行删除是行不通的，会因为filterItems的变化而误删任务项
				var index = this.items.indexOf(item);
				this.items.splice(index, 1)
			}
		},
	})

	//记得是写在Vue实例外面的
	window.onhashchange = function () {
		//获取路由的哈希值，不为零直接返回，为零返回all
		const hash = window.location.hash.substr(2)||'all'
		app.filterStatus = hash
	}

	//第一次访问时手动调用，让值生效
	window.onhashchange()
})(Vue);
