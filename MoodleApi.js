const axios = require('axios');

module.exports = class MoodleApi {
    constructor(url, token) {
        this.token = token;
        this.instance = axios.create({
            baseURL: url,
        }); 

        this.instance.interceptors.request.use(config => {
            config.params = {
                wstoken: this.token,
                moodlewsrestformat: 'json',
                ...config.params,
            };
            return config;
        });
    }

    getSiteInfo = () => 
        this._get('core_webservice_get_site_info');

    getCouresOfUser = userid => 
        this._get('core_enrol_get_users_courses', { userid });

    getGradesOfUser = (userid, courseid) => 
        this._get('gradereport_user_get_grades_table', { userid, courseid });

    _get = (name, params={}) =>
        this.instance.get('', {
            params: { wsfunction: name, ...params }
        })
        .then(res => res.data);
}
