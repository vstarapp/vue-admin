<template>
  <div class="editor-box">
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
import '@/plugins/ue/ueditor.config.js'
import '@/plugins/ue/ueditor.all.min.js'
import '@/plugins/ue/lang/zh-cn/zh-cn.js'
import '@/plugins/ue/ueditor.parse.min.js'
export default {
  name: 'UE',
  data () {
    return {
      editor: null
    }
  },
  props: {
    defaultMsg: {
      type: String
    },
    config: {
      type: Object
    }
  },
  mounted () {
    const _this = this
    this.editor = UE.getEditor('editor', this.config) // 初始化UE
    this.editor.addListener('ready', function () {
      _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
    })
  },
  methods: {
    getUEContent () { // 获取内容方法
      return this.editor.getContent()
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>
<style>
.editor-box{
    padding: 0 40px;
}

</style>
