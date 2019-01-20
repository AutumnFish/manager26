<template>
  <div class="user-container">
    <!-- 顶部面包屑 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <myBreadcrumb :level2="level2" :level3="level3"></myBreadcrumb>
        </div>
      </el-col>
    </el-row>
    <!-- 操纵框 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <!-- 添加用户  -->
          <el-button type="primary" @click="addVistable=true" plain>添加角色</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 用户数据 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="rolesList" style="width: 100%" border>
          <!-- 展开的table -->
          <el-table-column type="expand">
            <!-- 模板 -->
            <template slot-scope="props">
              <!-- 生成 最左边的一级菜单 -->
              <el-row v-for="item in props.row.children" :key="item.id">
                <el-col :span="4">
                  <el-tag @close="delCurrentTag(props.row,item)" closable>{{item.authName}}</el-tag>
                  <!-- 小箭头 -->
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 二级菜单 需要单独占一行 用row嵌套即可 -->
                  <el-row v-for="level2  in item.children" :key="level2.id">
                    <el-col :span="4">
                      <el-tag
                        @close="delCurrentTag(props.row,level2)"
                        closable
                        type="success"
                      >{{level2.authName}}</el-tag>
                      <!-- 小箭头 -->
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <!-- 三级菜单 跟二级是平齐的 -->
                    <el-col :span="20">
                      <el-tag
                        @close="delCurrentTag(props.row,level3)"
                        v-for="level3  in level2.children"
                        :key="level3.id"
                        closable
                        type="warning"
                      >{{level3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- 要么没有权限 -->
              <el-row v-if="props.row.children.length==0">
                <el-col :span="24">没有分配权限</el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="#" width="30" type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button
                @click="showEditDialog(scope.row)"
                type="primary"
                plain
                size="mini"
                icon="el-icon-edit"
              ></el-button>
              <!-- 删除 -->
              <el-button
                @click="delOne(scope.row)"
                type="danger"
                plain
                size="mini"
                icon="el-icon-delete"
              ></el-button>
              <!-- 获取权限列表 -->
              <el-button
                type="warning"
                plain
                size="mini"
                icon="el-icon-check"
                @click="showRolesDialog(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 对话框 添加框 -->
    <el-dialog title="添加角色" :visible.sync="addVistable">
      <el-form
        :model="addForm"
        label-position="left"
        label-width="80px"
        :rules="rules"
        ref="addForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVistable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 编辑框 -->
    <el-dialog title="编辑角色" :visible.sync="editVistable">
      <el-form
        :model="editForm"
        label-position="left"
        label-width="80px"
        :rules="rules"
        ref="editForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVistable = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 权限框框 -->
    <el-dialog title="分配权限" :visible.sync="roleVistable">
      <el-row>
        <el-col :span="24">
          <!-- 树形结构 -->
          <el-tree
            :data="totalRoles"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedKeys"
            :props="defaultProps"
            default-expand-all
            ref="tree"
          ></el-tree>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleVistable = false">取 消</el-button>
        <el-button type="primary" @click="submitRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "roles",
  data() {
    return {
      level2: "权限管理",
      level3: "角色列表",
      // 角色的数据
      rolesList: [],
      // 新增框显示标记
      addVistable: false,
      // 新增的数据
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      // 编辑框显示标记
      editVistable: false,
      // 编辑的数据
      editForm: {},
      // 权限框显示标记
      roleVistable: false,
      // 所有权限数据
      totalRoles: [],
      // 权限tree的对应关系
      defaultProps: {
        label: "authName"
      },
      // 默认选中的字段
      checkedKeys: [],
      // 为了共享数据
      selectRole: {},
      // 表单验证规则
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 3, max: 32, message: "长度在 3 到 32 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 32, message: "长度在 3 到 32 个字符", trigger: "blur" }
        ]
      }
    };
  },
  // 方法
  methods: {
    // 获取role数据的方法
    async getRoles() {
      // 依次往下执行
      let res = await this.$axios.get("roles");
      // console.log(res);
      this.rolesList = res.data.data;
    },
    // 添加角色
    submitForm(formName) {
      // 直接获取表单 验证
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 提交数据
          let res = await this.$axios.post("roles", this.addForm);
          // console.log(res);
          // 关闭对话框
          this.addVistable = false;
          if (res.data.meta.status == 201) {
            // 成功
            // 重新获取数据
            this.getRoles();
          } else {
            // 失败了
            // 提示用户
          }
        } else {
          this.$message.error("请检查数据");
          return false;
        }
      });
    },
    // 删除角色
    delOne(data) {
      // 获取用户id
      let id = data.id;
      // 提示用户
      this.$confirm("此操作讲永久删除这个角色,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger"
      })
        .then(async () => {
          // 确定
          let res = await this.$axios.delete(`roles/${id}`);
          // 重新获取用户数据即可
          this.getRoles();
        })
        .catch(() => {
          // 取消
          this.$message("谢不杀之恩");
        });
    },
    // 显示编辑框
    showEditDialog(data) {
      // 弹框
      this.editVistable = true;
      // 赋值
      this.editForm = data;
    },
    // 点击确认
    submitEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 提交数据
          let res = await this.$axios.put(
            `roles/${this.editForm.id}`,
            this.editForm
          );

          this.editVistable = false;
          if (res.data.meta.status == 201) {
            // 成功
            // 重新获取数据
            this.getRoles();
          } else {
            // 失败了
            // 提示用户
          }
        } else {
          this.$message.error("请检查数据");
          return false;
        }
      });
    },
    // 显示权限框
    async showRolesDialog(data) {
      // 保存 正在编辑权限的角色
      this.selectRole = data;
      // 显示框
      this.roleVistable = true;
      // 获取所有权限列表
      let res = await this.$axios.get("rights/tree");
      // 保存数据到data中 总的权限列表
      this.totalRoles = res.data.data;
      // 获取 选中的那些选项
      this.checkedKeys = [];
      // 遍历 获取所有的 权限id
      // 使用递归的方式获取 所有后代节点
      let findChild = father => {
        // 找后代
        if (father.children) {
          console.log("有儿子");
          father.children.forEach(v => {
            // this.checkedKeys.push(v.id);
            // 每一个儿子 有可能有后代
            findChild(v);
          });
        } else {
          // 没有后代
          console.log("没有后代啦");
          // 因为tree这个组件的问题 如果父id 设置被选中 会默认选中它的所有子节点
          // 只需要添加最底层的即可
          this.checkedKeys.push(father.id);
        }
      };
      // 调用函数
      findChild(data);

      console.log(this.checkedKeys);

      console.log(res);
    },
    // 提交 权限分配
    async submitRoles() {
      // 获取选中的权限
      // console.log(this.$refs.tree.getCheckedKeys());
      // console.log(this.$refs.tree.getHalfCheckedKeys());
      // 选中的key
      let checkedKeys = this.$refs.tree.getCheckedKeys();
      // 半选中的key 子项自选中了部分 但是父节点的id也要获取
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      // 两个数组 -> id1,id2,id3 的字符串
      let totalKeys = checkedKeys.concat(halfCheckedKeys);
      // console.log(totalKeys);
      let rids = totalKeys.join(",");
      // console.log(rids);
      // 调用接口 修改权限
      let res = await this.$axios.post(`roles/${this.selectRole.id}/rights`, {
        rids
      });
      console.log(res);
      // 隐藏 权限框(tree)
      this.roleVistable = false;
      // 重新获取角色数据即可
      this.getRoles();
    },
    // 删除角色的指定权限
    async delCurrentTag(role, right) {
      // console.log(role);
      // console.log(right);
      let res = await this.$axios.delete(`roles/${role.id}/rights/${right.id}`);
      // console.log(res);
      // 全部重新获取 会折叠起来 用户体验不好
      // this.getRoles();

      // 可以直接 把服务器返回的新权限  赋值给当前角色
      role.children = res.data.data;
    }
  },
  // 生命周期函数
  async created() {
    this.getRoles();
  }
};
</script>
<style lang="scss" scoped>
.user-container {
  // background-color: #af676b;
}

.el-tag {
  margin: 10px;
}
</style>
