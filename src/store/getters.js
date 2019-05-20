const getters = {
    token: state => state.user.token,
    uid: state => state.user.uid,
    majors: state => state.user.majors,
    type: state => state.user.type
}

export default getters
