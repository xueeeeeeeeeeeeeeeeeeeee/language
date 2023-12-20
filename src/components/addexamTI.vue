<template>
  <div class="index">
    <div class="rightbody">
      <div class="index-mainbody">
        <a-button @click="adddata">导入</a-button>
        <a-table
          id="tabledata"
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="data"
          :pagination="{ pageSize: 4 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'tags'">
              <span>
                <a-tag v-for="tag in record.tags" :key="tag" :color="'green'">
                  {{ tag.toUpperCase() }}
                </a-tag>
              </span>
            </template>
          </template>
          <template #operation="{ column, record }">
            <div class="editable-rowtemplate-operations">
              <span>
                <a @click="edit(record)">编辑</a>
              </span>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
  <script setup>
  import axios from 'axios';
  import { message } from "ant-design-vue";
import { select } from "../js/axiosselect.js";
import { useRouter } from "vue-router";
const router = useRouter();
import {
  reactive,
  ref,
  watch,
  toRefs,
  computed,
  unref,
  onMounted,
  onUpdated,
  defineComponent,
} from "vue";
const indata = ref("");
import { Table } from "ant-design-vue";
import addquestionVue from "@/components/addquestion.vue";
const selectedKeys = ref(["1"]);
const openKeys = ref(["sub1"]);
const visible = ref(false);
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const editcol = ref([]);
const props = defineProps({
  UnitID: String,
});

let { UnitID } = toRefs(props);
watch(UnitID, async (val) => {
    console.log(UnitID._object.UnitID);
  if (!localStorage.getItem("token")) {
  }
  var x = { key: 1 };
  select(x).then((res) => {
    if (res.data == "logout") {
      router.push("/login");
    } else {
      columns.value = res.col;
      data.value = res.data;
      for (var i = 0; i < data.value.length; i++) {
        data.value[i].key = i;
      }
      for (var i = 0; i < res.col.length - 1; i++) {
        editcol.value.push(res.col[i].dataIndex);
      }
    }

    console.log(res);
  });
});
const columns = ref([
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
]);
const data = ref([]);
const token = ref("");
const selectedRowKeys = ref([]);
const onSelectChange = (changableRowKeys) => {
  selectedRowKeys.value = changableRowKeys;
};
onMounted(() => {
    console.log(UnitID._object.UnitID);
  if (!localStorage.getItem("token")) {
  }
  var x = { key: 1 };
  select(x).then((res) => {
    if (res.data == "logout") {
      router.push("/login");
    } else {
      columns.value = res.col;
      data.value = res.data;
      for (var i = 0; i < data.value.length; i++) {
        data.value[i].key = i;
      }
      for (var i = 0; i < res.col.length - 1; i++) {
        editcol.value.push(res.col[i].dataIndex);
      }
    }

    console.log(res);
  });
});
const edit = (key) => {};
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
            for (var i = 0; i < selectedRowKeys._rawValue.length; i++) {
              if (index == selectedRowKeys._rawValue[i]) {
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

const imprtdata = () => {};
const adddata = () => {
  console.log(rowSelection.value.selectedRowKeys);
  for (var i = 0; i < rowSelection.value.selectedRowKeys.length; i++) {
    console.log(data.value[rowSelection.value.selectedRowKeys[i]].QuestionID);
    bindTi(data.value[rowSelection.value.selectedRowKeys[i]].QuestionID);
  }
  message.info("绑定成功");
};
const bindTi=async(x)=>{
    let formData = new FormData();
    formData.append("token", localStorage.getItem('token'));
    formData.append("QuestionID", x);
    formData.append("UnitID",UnitID._object.UnitID);
    await axios({
        method: "post",
        url: "/tiku/BindTiWithExam",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(async function (response) { // 声明为async函数
        console.log(response);

    });
}
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
.editable-row-operations a {
  margin-right: 8px;
}
</style>