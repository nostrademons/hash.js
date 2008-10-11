(function() {
/**
 * Hashtable implementation.  This provides a 'length' property that's
 * maintained throughout all updates, and has no restrictions upon the
 * types of keys that may be used.
 * 
 * @class Hash
 */
if(typeof window.Hash != 'undefined') {
    var _Hash = window.Hash;
}

var Hash = window.Hash = function(args) {
    if(this instanceof arguments.callee) {
        this.init.apply(this, args && args.callee ? args : arguments);
    } else {
        return new Hash(arguments);
    }
};

Hash.no_conflict = function() {
    window.Hash = _Hash;
    return Hash;
};

Hash.prototype = {

    /**
     * Creates a new Hash.  If the copy_from object is specified, it copies
     * the keys and values from that.
     * 
     * @constructor
     * @member Hash
     * @param {Object} copy_from Copy fields/values from this object (optional)
     */
    init: function(copy_from) {
        this.empty();
        if(copy_from) {
            this.update(copy_from);
        }
    },

    /**
     * Returns the value of a key, or undefined if not set.
     * 
     * @member Hash
     * @param {String} key Key to retrieve.
     */
    get: function(key) {
        return this.hash[key];
    },

    /**
     * Returns true if this hashtable contains the specified key.
     * 
     * @member Hash
     * @param {String} key Key to test.
     */
    contains: function(key) {
        return this.get(key) !== undefined;
    },

    /**
     * Sets key to val, then returns val.
     *
     * @member Hash
     * @param {String} key Key to set.
     * @param {Object} val Value to set it to.
     */
    put: function(key, val) {
        if(!this.contains(key)) {
            this.length++;
        }
        this.hash[key] = val;
        return val;
    },

    /**
     * Removes a key, returning the hashtable itself.
     *
     * @member Hash
     * @param {String} key Key to remove.
     */
    remove: function(key) {
        delete this.hash[key];
        this.length--;
        return this;
    },

    /**
     * Sets a key if it doesn't already exist.
     * 
     * @member Hash
     * @param {String} key Key to set.
     * @param {Object} default_val Value to set it to if key doesn't exist.
     * @returns {Object} The value of the key.
     */
    ensure: function(key, default_val) {
        var current_val = this.get(key);
        if(current_val === undefined) {
            return this.put(key, default_val);
        }
        return current_val;
    },

    /**
     * Sets a key if it doesn't already exist.  Instead of taking a default
     * value, takes a function of the key and evaluates that to get the
     * default.  This lets you defer construction costs until they're really
     * needed.
     *
     * @member Hash
     * @param {String} key Key to set.
     * @param {Function(key)} default_fn Function to invoke if key doesn't exist.
     * @returns {Object} The value of the key.
     */
    lazy_ensure: function(key, default_fn) {
        var current_val = this.get(key);
        if(current_val === undefined) {
            return this.put(key, default_fn(key));
        }
        return current_val;
    },

    /**
     * Removes and returns the specified key.
     * 
     * @member Hash
     */
    pop: function(key) {
        var current_val = this.get(key);
        this.remove(key);
        return current_val;
    },

    /**
     * Copies all properties of the specified object to this hash.  Does not
     * consider values inherited from the prototype.
     * 
     * @member Hash
     * @returns {Hash} The Hash itself.
     */
    update: function(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                this.put(prop, obj[prop]);
            }
        }
        return this;
    },

    /**
     * Removes all entries from this hash.
     * 
     * @member Hash
     * @returns {Hash} The hash itself.
     */
    empty: function() {
        this.hash = {};
        this.length = 0;
        return this;
    },

    /**
     * Returns a list of all keys in this hash.  The list is in unspecified 
     * order, and does not share structure with the Hash.
     * 
     * @member Hash
     * @type Array<String>
     */
    keys: function() {
        var keys = [];
        for(var prop in this.hash) {
            keys.push(prop);
        }
        return keys;
    },

    /**
     * Returns a list of all values in this hash.  The list is in unspecified
     * order, and does not share structure with the Hash.  Values retain their
     * identities.
     *
     * @member Hash
     * @type Array<Object>
     */
    values: function() {
        var values = [];
        for(var prop in this.hash) {
            values.push(this.hash[prop]);
        }
        return values;
    },

    /**
     * Returns a list of [key, value] arrays for this hash.
     *
     * @member Hash
     * @type Array<Array<String, Object>>
     */
    items: function() {
        var items = [];
        for(var prop in this.hash) {
            items.push([prop, this.hash[prop]]);
        }
        return items;
    },

    /**
     * Returns a { key: value } JavaScript object with the contents of this
     * hash.  This shares structure with the hash; mutations to it affect
     * the original Hash object and vis versa.  Make a copy if you don't
     * want this behavior.
     *
     * @member Hash
     * @type Array<{ key: String, value: Object}>
     */
    items_obj: function() {
        return this.hash;
    }
};

})();
