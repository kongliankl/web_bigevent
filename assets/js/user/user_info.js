$(function () {
    const layer = layui.layer
    const form = layui.form

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return `用户昵称必须在1~6个字符之间`
            }
        }
    })

    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    $('#formReset').click(function (e) {
        // 阻止默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                window.parent.getUserInfo()
            }
        })
    })
})

