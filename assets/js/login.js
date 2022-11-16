$(function () {
    $('#login').click(function () {
        $('.login').hide()
        $('.reg').show()
    })
    $('#reg').click(function () {
        $('.login').show()
        $('.reg').hide()
    })
    const form = layui.form
    const layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            const pwd = $('.reg [name="password"]').val()
            if (pwd !== value) {
                return '两次密码不一致!'
            }
        }
    })
    $('.reg #reg-form').on('submit', function (e) {
        e.preventDefault()
        const data = {
            username: $('#reg-form [name="username"]').val(), password: $('#reg-form [name="password"]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status === 0) {
                layer.msg('注册成功，请登录')
                $('#reg').click()
            } else {
                layer.msg(res.message)
            }
        })
    })
    $('.login #login-form').submit(function (e) {
        e.preventDefault()
        // 快速获取表单值 $(this).serialize()
        $.post('/api/login', $(this).serialize(), function (res) {
            if (res.status === 0) {
                layer.msg('登录成功')
                localStorage.setItem('token', res.token)
                location.href = './index.html'
            } else {
                layer.msg(res.message)
            }
        })
    })
})