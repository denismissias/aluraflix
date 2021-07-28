const validator = require ('validator');
const validationException = require('../core/validationException');

class Video {
    id;
    #title;
    #description;
    #url;

    constructor(title, description, url) {
        this.#title = title;
        this.#description = description;
        this.#url = url;
        this.validate();
    }

    validate() {
        if (this.isEmpty()) {
            throw new validationException("Todos os campos devem ser preenchidos.");
        }     
    }

    isEmpty() {
        if (this.#title == undefined || validator.isEmpty(this.#title)) 
            return true;
        if (this.#description == undefined || validator.isEmpty(this.#description)) 
            return true;
        if (this.#url == undefined || validator.isEmpty(this.#url)) 
            return true;
        
        return false;
    }

    get title() {
        return this.#title;
    }

    get description() {
        return this.#description;
    }

    get url() {
        return this.#url;
    }
}

module.exports = Video;