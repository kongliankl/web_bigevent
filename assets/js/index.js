$(function () {
    const layer = layui.layer
    getUserInfo()
    $('#logOut').click(function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token')
            location.href = './login.html'
            layer.close(index)
        })
    })
})

// 发送ajax请求，获取用户信息
function getUserInfo() {
    // console.log(111)
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res)
            if (res.status === 0) {
                renderUserInfo(res.data)
            } else {
                return layer.msg('获取用户信息失败')
            }
        }
    })
}
// 渲染用户信息
function renderUserInfo(info) {
    const name = info.nickname || info.username
    $('#welcome').html(`欢迎&nbsp&nbsp${name}`)
    if (info.user_pic) {
        $('.layui-nav-img').attr('src', info.user_pic)
        $('.text-avatar').hide()
    } else {
        const first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').html(first)
    }
}