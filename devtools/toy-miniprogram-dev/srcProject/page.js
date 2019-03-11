Page({
	data: {
		count:0
	},
	clickedCount(e) {
		this.setData({count:this.data.count+1});
	}
})
