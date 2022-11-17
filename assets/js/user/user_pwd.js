$(function () {
    const form = layui.form
    const layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        same1: function (value) {
            const oldPwd = $('[name="oldPwd"]').val()
            if (value === oldPwd) {
                return '新旧密码不能相同！'
            }
        },
        same2: function (value) {
            const newPwd = $('[name="newPwd"]').val()
            if (value !== newPwd) {
                return '两次密码不一致！'
            }
        }
    })
    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                // 重置表单
                $('[type="reset"]').click()
                // $(this)[0].reset() // 也可以重置表单 $(this)[0]是原生DOM的form元素
            }
        })
    })
})