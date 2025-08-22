import http from '@/utils/request.js'

export const Postlogin = (data) => {
    return http.post('/login', data)
}
export const Getmenus = () => {
    return http.get('/menus')
}
export const Getuserlist = (params = {}) => {
    return http.get('/users', { params })
}
export const Postusers = (data) => {
    return http.post('/users', data)
}
export const Putusers_status = (id, type) => {
    return http.put(`/users/${id}/state/${type}`)
}
export const Putusers = (id, data) => {
    return http.put(`/users/${id}`, data)
}
export const Deleteusers = (id) => {
    return http.delete(`/users/${id}`)
}
export const Putusersrid = (id, data) => {
    return http.put(`/users/${id}/role`, data)
}
export const Getroles = () => {
    return http.get(`/roles`)
}
export const Postroles = (data) => {
    return http.post(`/roles`, data)
}
export const Putroles = (id, data) => {
    return http.put(`/roles/${id}`, data)
}
export const Deleteroles = (id) => {
    return http.delete(`/roles/${id}`)
}
export const Postrolesrights = (id, data) => {
    return http.post(`/roles/${id}/rights`, data)
}
export const Deleterolesrights = (id, rid) => {
    return http.delete(`/roles/${id}/rights/${rid}`)
}
export const Getrights = (type) => {
    return http.get(`/rights/${type}`)
}
export const Getgoods = (params = {}) => {
    return http.get('/goods', { params })
}
export const Getgoodsid = (id) => {
    return http.get(`/goods/${id}`)
}
export const Postgoods = (data) => {
    return http.post('/goods', data)
}
export const Deletegoods = (id) => {
    return http.delete(`/goods/${id}`)
}
export const Putgoods = (id, data) => {
    return http.put(`/goods/${id}`, data)
}
export const Getcategories = (params = {}) => {
    return http.get('/categories', { params })
}
export const Putcategories = (id, data) => {
    return http.put(`/categories/${id}`, data)
}
export const Postcategories = (data) => {
    return http.post('/categories', data)
}
export const Deletecategories = (id) => {
    return http.delete(`/categories/${id}`)
}
export const GetcategoriestabHandle = (id, params) => {
    return http.get(`/categories/${id}/attributes`, { params })
}
export const PostcategoriestabHandle = (id, data) => {
    return http.post(`/categories/${id}/attributes`, data)
}
export const DeltcategoriestabHandle = (id, attr_id) => {
    return http.delete(`/categories/${id}/attributes/${attr_id}`)
}
export const PutcategoriestabHandle = (id, attr_id, data) => {
    return http.put(`/categories/${id}/attributes/${attr_id}`, data)
}
export const Getorders = (params = {}) => {
    return http.get(`/orders`, { params })
}
export const Putorders = (id, data) => {
    return http.put(`/orders/${id}`, data)
}
export const Getordersdetail = (id) => {
    return http.get(`/orders/${id}`)
}
export const Getkuaidi = (id) => {
    return http.get(`/kuaidi/${id}`)
}
export const Getreports = (id) => {
    return http.get(`reports/type/1`)
}