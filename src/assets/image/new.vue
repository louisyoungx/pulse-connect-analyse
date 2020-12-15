<template>
	      <view class="main-container">
			  <view class="list-item">
			     <view class="label-container">
			           姓名:
			      </view>
			       <view class="select-container">
			         <input   v-model="username"  />
			    </view>
			  </view>
			  
	       <view class="list-item">
	          <view class="label-container">
	                性别:
	           </view>
	            <view class="select-container">
	             <picker @change="handleSexChange" :value="sexIndex" :range="sex">
	                     <view class="right-container">{{sex[sexIndex]}}</view>
	               </picker>  
	         </view>
	       </view>
		   <view class="list-item">
		      <view class="label-container">
		            年龄:
		       </view>
		        <view class="select-container">
		         <picker @change="handleAgeChange" :value="ageIndex" :range="age">
		                 <view class="right-container">{{age[ageIndex]}}</view>
		           </picker>  
		     </view>
		   </view>
		   <view class="btn">
		   	<button type="primary" class="start-btn"  @click="handleStart">开始测试</button>
		   </view>
		   <view class="btn">
		   	<button type="primary" class="start-btn">停止测试</button>
		 </view></view>
	  </template>


<script>
	
	export default {
	    data() {
	        return {
	            sex: ['男', '女'],
	            sexIndex: 0,
				age:[16,17,18,19,20,21,22,23,24,25],
				ageIndex:0,
				username:""
	        }
	    },
	
	    methods: {
	        handleSexChange: function(e) {
	            this.sexIndex = e.target.value
	        },
			handleAgeChange:function(e){
				 this.ageIndex = e.target.value
			},
			handleStart(){
				uni.navigateTo({
					url:'/pages/foldLine/line'
				})
			}
	       
	      
	    }
	}

</script>

<style>
.main-container{
	width:100%;
	display: block;
	box-sizing: border-box;
	padding:5px 10px;
}
.list-item{
	padding:5px 0;
	/* width: 100%; */
	display: flex;
	/* justify-content: space-between; */
	align-items: center;
	background-color: white;
	border: 1px solid white;
	margin-bottom:5px;
	}
.label-container{
	margin-left:5px;
	
}
.select-container{
    flex:1;
	text-align: right;
	margin-right:5px;
}
uni-picker{
	width:100%;
}
.right-container{
	display: flex;
	justify-content: flex-end;
}
.show-container{
	width:100%;
}
	.btn{
		display: block;
		
	}
	.start-btn{
		margin-bottom:5px;
	}
	
	
</style>
