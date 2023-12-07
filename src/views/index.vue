<template>
  <div class="index">
    <div class="leftnav">
      <div class="logo">汉语小程序-教师端</div>
      <a-menu
        id="dddddd"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        style="width: 100%"
        mode="inline"
        :items="items"
        @click="handleClick"
      ></a-menu>
    </div>
    <div class="rightbody">
      <div class="nav"></div>
      <div class="index-mainbody">
        <a-table
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="data"
          :pagination="{ pageSize: 7 }"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, watch, computed, unref } from "vue";
import { Table } from "ant-design-vue";
const selectedKeys = ref(["1"]);
const openKeys = ref(["sub1"]);
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = reactive([
  getItem("课程管理", "1"),
  getItem("班级管理", "2"),
  getItem("测试管理", "3"),
  getItem("资源管理", "4"),
  getItem("题库筛选", "5"),
  getItem("学籍管理", "6"),
]);
const handleClick = (e) => {
  console.log("click", e);
};
watch(openKeys, (val) => {
  console.log("openKeys", val);
});
const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];
const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}
const selectedRowKeys = ref([]);
const onSelectChange = (changableRowKeys) => {
  console.log("selectedRowKeys changed: ", changableRowKeys);
  selectedRowKeys.value = changableRowKeys;
};
const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    onChange: onSelectChange,
    hideDefaultSelections: true,
    selections: [
      {
        key: "odd",
        text: "全选当页",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            return true;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
      {
        key: "odd",
        text: "反选当页",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            console.log(selectedRowKeys._rawValue);
            for(var i=0;i<selectedRowKeys._rawValue.length;i++){
                if(index==selectedRowKeys._rawValue[i]){
                console.log("false");
                return false;
            
            }
            }
         
            return true;
          });
          selectedRowKeys.value = newSelectedRowKeys;
      
        },
      },
      {
        key: "odd",
        text: "清除当页",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            return false;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
      {
        key: "odd",
        text: "选择偶数",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
      {
        key: "even",
        text: "选择奇数",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
    ],
  };
});
</script>
<style>
.index {
  width: 100%;
  height: 100%;
  display: flex;
}
.leftnav {
  width: 20%;
  height: 100%;
  /* background-color: red; */
  border-right: #e4e7ed solid 2px;
}
.logo {
  width: 100%;
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
}
.rightbody {
  width: 80%;
  height: 100%;
}
.nav {
  width: 100%;
  height: 3em;
  background-color: aqua;
}
.index-mainbody {
  width: 100%;
  padding-top: 5%;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 5%;
  /* height: 100%; */
  /* background-color: rebeccapurple; */
}
</style>