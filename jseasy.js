(function defineIsValidator(global) {
    'use strict';

    var VERSION = '0.5.0';

    var is = {};

    is.VERSION = VERSION;
    is.ENVIRONMENT = (typeof window !== "undefined") ? 'Browser' : 'Server';

    var types = ['Array', 'String', 'RegExp', 'Undefined', 'Null', 'Boolean', 'Function', 'Date'];

    (function ObjectCreatePolyfill() {
        if (!Object.create) {
            Object.create = function (o) {
                function F() { }
                F.prototype = o;
                return new F();
            };
        }
    }());

    /**
     * Looping trough list of types and create functions
     * to validate types of data.
     *
     * Loop will append functions from
     * types to 'is' object.
     *
     * @version 0.1.0
     */
    for (var i = 0; i < types.length; i++) {
        (function (j) {
            var _type = types[j];
            is[_type.toLowerCase()] = function validate(value) {
                return Object.prototype.toString.call(value) === "[object " + _type + "]";
            };
        }(i));
    }

    /**
     * is.number
     *
     * Validates if value is numeric.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.number = function validateNumber(value) {
        // Prevent corner case where type of NaN is number.
        if (this.NaN(value)) {
            return false;
        } else {
            return this.equal(Object.prototype.toString.call(value), "[object Number]");
        }
    };

    /**
     * is.undefined
     *
     * Validate if value is undefined
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.2.0
     */
    is.undefined = function validateUndefined(value) {
        return this.equal(value, undefined);
    };

    /**
    * is.null
    *
    * Validates if value is null.
    *
    * @param {any} value
    * @alias is.nil
    * @returns {Boolean}
    * @version 0.2.0
    */
    is.null = is.nil = function validateNull(value) {
        return this.equal(value, null);
    };

    /**
     * is.integer
     *
     * Validates if value is numeric and integer since all values
     * in javascript are always 64-bit floating point.
     *
     * Numbers with tracing 0 are assumed as integer.
     * ex: 14.00000000
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.integer = function validateInteger(value) {
        if (this.number(value)) {
            return this.equal((value | 0), value);
        } else {
            return false;
        }
    };

    /**
     * is.NaN
     *
     * Validates if value is NaN and NaN only.
     *
     * native 'isNaN' function has bug where anything
     * that is literaly not number is true.
     *
     * @param {any} value
     * @alias is.nan
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.NaN = is.nan = function validateNaN(value) {
        return this.notEqual(value, value);
    };

    /**
     * is.infinite
     *
     * Validate if value is Infinity.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.infinite = function validateFiniteNumber(value) {
        return this.equal(value, Infinity) || this.equal(value, -Infinity);
    };

    /**
     * is.defined
     *
     * Validates if value is not undefined.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.defined = function validateDefined(value) {
        return this.notEqual(value, undefined) && this.notEqual(value, "undefined");
    };

    /**
     * is.object
     *
     * Validates if value is object.
     *
     * arrays and null returns false since they
     * are not considered as first class object.
     *
     * @param {any} obj
     * @alias is.obj
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.object = is.obj = function validateObject(obj) {
        return this.equal(obj, Object(obj)) && !this.array(obj);
    };

    /**
     * is.htmlElement
     *
     * Validate if object is instance of HTMLElement.
     *
     * @param {any} element
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.htmlElement = function validateElement(element) {
        return element instanceof HTMLElement;
    };

    /**
     * is.arrayLike
     *
     * Validates if object is array like.
     *
     * See difference between Array and Array like object here:
     * https://stackoverflow.com/questions/29707568/javascript-difference-between-array-and-array-like-object#answer-29707677
     *
     * Version 0.4.0
     * - Fixed bug with corner case where null and undefined
     * does not have lenght property.
     *
     * @param {any} element
     * @returns {Boolean}
     * @version 0.1.0
     * @update 0.4.0
     */
    is.arrayLike = function validateArrayLike(element) {
        if (is.something(element)) {
            if (this.number(element.length)) {
                return this.equal(element.length, 0) || element.hasOwnProperty(element.length - 1);
            }
        }
        return false;
    };

    /**
     * is.something
     *
     * Validates if value is not null, undefined or NaN.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.something = function validateIfSomething(value) {
        return !this.null(value) && this.defined(value) && !this.NaN(value);
    };

    /**
     * is.falsy
     *
     * Returns true for always falsy values:
     *
     * [0, false, "", null, undefined, NaN]
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.falsy = function validateFalsy(value) {
        return this.equal(Boolean(value), false);
    };

    /**
     * is.truthy
     *
     * Returns true for all values except:
     *
     * [0, false, "", null, undefined, NaN]
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.truthy = function validateTruthy(value) {
        return Boolean(value);
    };

    /**
     * is.notEmpty
     *
     * Check if value is not null, undefined, NaN of empty string.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.1.0
     */
    is.notEmpty = function validateNotEmpty(value) {
        return this.something(value) && this.notEqual(value, "");
    };

    /**
     * is.odd
     *
     * Validate if number is odd.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.2.0
     */
    is.odd = function validateOdd(value) {
        return Boolean(value % 2);
    };

    /**
     * is.even
     *
     * Validate if number is even
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.2.0
     */
    is.even = function validateEven(value) {
        return !this.odd(value);
    };

    /**
     * is.json
     *
     * Validate if string is a valid JSON.
     *
     * For JSON to be valid all keys must be wrapped
     * by double quotes. And whole string in single quotes
     * since JSON.parse throw an error of unexpected token ' in JSON.
     *
     * Inspired by "Bourne" on stack-overflow
     * https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not#answer-9804835
     *
     * @param {String} value
     * @returns {Boolean}
     * @version 0.2.0
     */
    is.json = function validateJSON(value) {
        if (this.string(value)) {
            try {
                JSON.parse(value);
                return true;
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    };

    /**
     * is.zero
     *
     * Validates if value is zero.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.zero = function validateZero(value) {
        return this.equal(value, 0);
    };

    /**
     * is.positiveZero
     *
     * Validate if value is positive zero.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.positiveZero = function validatePositiveZero(value) {
        return this.number(value) && this.zero(value) && 1 / value > 0;
    };

    /**
     * is.negativeZero
     *
     * Validate if value is negative zero.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.negativeZero = function validateNegativeZero(value) {
        return this.number(value) && this.zero(value) && 1 / value < 0;
    };

    /**
     * is.positive
     *
     * Validates if number is positive number.
     *
     * Posible improvement: Include positive zero as true.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.positive = function validatePositiveNumber(value) {
        return this.number(value) && value > 0;
    };

    /**
     * is.negative
     *
     * Validates if number is negative number.
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.negative = function validateNegativeNumber(value) {
        return this.number(value) && value < 0;
    };

    /**
     * is.equal
     *
     * Check triple equality of two values.
     *
     * TODO: object and array equality.
     *
     * @param {any} n
     * @param {any} m
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.equal = function validateTripleEquality(n, m) {
        return n === m;
    };

    /**
     * is.notEqual
     *
     * Check if two values are not triple equal.
     *
     * @param {any} n
     * @param {any} m
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.notEqual = function validateTripleNotEquality(n, m) {
        return n !== m;
    };

    /**
     * is.inArray
     *
     * Validate if item is contained in array.
     *
     * @param {Array} array
     * @param {any} value
     * @returns {Boolean}
     * @throws Error.
     * @version 0.3.0
     */
    is.inArray = function validateIfInArray(array, value) {
        return _doIfArray(array, function checkinArray() {
            return Boolean(~array.indexOf(value)); // ~n => -(n + 1)
        });
    };

    /**
     * is.alphaWord
     *
     * Validates if string contains only word with alpha characters.
     * a-z or A-Z
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.alphaWord = function validateAlphanumericString(value) {
        if (this.string(value) && this.notEmpty(value)) {
            return /^[a-zA-Z]*$/.test(value);
        } else {
            return false;
        }
    };

    /**
     * is.float
     * Validate if number is float (double).
     *
     * @param {any} value
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.float = function validateFloatNumber(value) {
        return this.number(value) && Boolean(value % 1);
    };

    /**
     * is.inNumberRange
     *
     * Validate if number is in range from n to m
     * without including them.
     *
     * @param {Number} value
     * @param {Number} min
     * @param {Number} max
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.inNumberRange = function validateInRangeNumber(value, min, max) {
        if (_argumentsAreNumbers(_toArray(arguments))) {
            return value > min && value < max;
        } else {
            _fail('Function is expecting number type arguments.');
        }
    };

    /**
     * is.inNumberRangeIncluding
     *
     * Validate if number is in range from n to m
     * including them.
     *
     * @param {Number} value
     * @param {Number} min
     * @param {Number} max
     * @returns {Boolean}
     * @version 0.3.0
     */
    is.inNumberRangeIncluding = function validateInRageNumberIncluding(value, min, max) {
        if (_argumentsAreNumbers(_toArray(arguments))) {
            return this.min(value, min) && this.max(value, max);
        } else {
            _fail('Function is expecting number type arguments.');
        }
    };

    /**
     * is.hexColor
     *
     * Validate if string is hex color.
     *
     * @param {String} colorString
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.hexColor = function validateHexColor(colorString) {
        return _doIfString(colorString, function validString() {
            var pattern = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;
            return pattern.test(colorString);
        });
    };

    /**
     * is.min
     *
     * Validate if number is greater then min value.
     *
     * @param {Number} value
     * @param {Number} min
     * @returns {Boolean | Error}
     * @version 0.4.0
     */
    is.min = function validateMin(value, min) {
        if (_argumentsAreNumbers(_toArray(arguments))) {
            return value >= min;
        } else {
            _fail('Function expects numbers as arguments.');
        }
    };

    /**
     * is.max
     *
     * Validate if number is less then max value.
     *
     * @param {Number} value
     * @param {Number} max
     * @returns {Boolean | Error}
     * @version 0.4.0
     */
    is.max = function validateMax(value, max) {
        if (_argumentsAreNumbers(_toArray(arguments))) {
            return value <= max;
        } else {
            _fail('Function expects numbers as arguments.');
        }
    };

    /**
     * is.creditCard
     *
     * Validate if given string is valid credit card.
     * Credit card validator has been build using Luhn
     * algorithm also known as "modulus 10" algorithm
     * created by IBM scientist Hans Peter Luhn in 1950's.
     *
     * You can read more about Luhn algorithm on wikipedia at:
     * https://en.wikipedia.org/wiki/Luhn_algorithm
     *
     * And you can also check following videos to see
     * algorithm in practice.
     *
     * https://www.youtube.com/watch?v=wsphC8V36i0
     *
     * https://www.youtube.com/watch?v=hWkAe9FsfiE
     *
     * TODO: Change digit mapping to functional composition.
     *
     * @param {String} cardNumber
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.creditCard = function validateCreditCard(cardNumber) {
        if (_couldBeCreditCard(cardNumber)) {
            // Will be changed to functional composition in next release.
            var cardDigits = _mapStringToNumber(_toArray(_trimNonNumeric(cardNumber), 0, -1));
            var sum = +cardNumber.substr(-1); // Implicit array to number coersion.

            _eachReversed(_luhnCheck.bind(is), cardDigits);

            return this.equal(sum % 10, 0);
        } else {
            return false;
        }

        // Helper logic function. Main execution happens above.
        function _luhnCheck(digit, index, iteration) {
            if (this.odd(iteration)) {
                var doubleDigit = digit * 2; // Double every odd iteration.
                if (doubleDigit > 9) {
                    sum += doubleDigit - 9;
                } else {
                    sum += doubleDigit;
                }
            } else {
                sum += digit;
            }
        }
    };

    /**
     * Issuer identification number (IIN)
     *
     * List of credit card IIN regex.
     *
     * Regex built based on wikipedia article at:
     * https://en.wikipedia.org/wiki/Payment_card_number#Major_Industry_Identifier_.28MII.29#Issuer_identification_number_(IIN)
     * or at cybersource:
     * https://www.cybersource.com/developers/getting_started/test_and_manage/best_practices/card_type_id/
     *
     * @private
     * @version 0.4.0
     */
    var _IIN = {
        americanExpress: /^3[4-7]/,
        visa: /^4/,
        maestro: /^6|^5[0|6-8]/,
        jcb: /^3088|^3096|^3112|^3158|^3337|^35[2-8][0-9]/,
        dinersClub: /^36|^30[0-5]|^3095|^3[8-9]/,
        masterCard: /^5[1-5]|^2[2-7]/,
        discover: /^6[0|4|5]/
    };

    /**
     * is.americanExpress
     *
     * Validate if credit card number
     * matches American Express Card.
     *
     * @param {any} cardNumber
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.americanExpress = function validateAmericanExpress(cardNumber) {
        if (this.creditCard(cardNumber)) {
            var cardDigits = _trimNonNumeric(cardNumber);
            return _IIN.americanExpress.test(cardNumber);
        } else {
            return false;
        }
    };

    /**
     * is.visa
     *
     * Validate if credit card number
     * matches Visa Card.
     *
     * @param {any} cardNumber
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.visa = function validateVisa(cardNumber) {
        if (this.creditCard(cardNumber)) {
            var cardDigits = _trimNonNumeric(cardNumber);
            return _IIN.visa.test(cardNumber);
        } else {
            return false;
        }
    };

    /**
     * is.maestro
     *
     * Validate if credit card number
     * matches Maestro Card.
     *
     * @param {any} cardNumber
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.maestro = function validateMaestro(cardNumber) {
        if (this.creditCard(cardNumber)) {
            var cardDigits = _trimNonNumeric(cardNumber);
            return _IIN.maestro.test(cardNumber);
        } else {
            return false;
        }
    };

    /**
     * is.jcb
     *
     * Validate if credit card number
     * matches JCB Card.
     *
     * @param {any} cardNumber
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.jcb = function validateJcb(cardNumber) {
        if (this.creditCard(cardNumber)) {
            var cardDigits = _trimNonNumeric(cardNumber);
            return _IIN.jcb.test(cardNumber);
        } else {
            return false;
        }
    };

    /**
     * is.dinersClub
     *
     * Validate if credit card number
     * matches Diners club Card.
     *
     * @param {any} cardNumber
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.dinersClub = function validateDinersClub(cardNumber) {
        if (this.creditCard(cardNumber)) {
            var cardDigits = _trimNonNumeric(cardNumber);
            return _IIN.dinersClub.test(cardNumber);
        } else {
            return false;
        }
    };

    /**
     * is.masterCard
     *
     * Validate if credit card number
     * matches Master Card.
     *
     * @param {String} cardNumber
     * @return {Boolean}
     * @version 0.4.0
     */
    is.masterCard = function validateMasterCard(cardNumber) {
        if (this.creditCard(cardNumber)) {
            var cardDigits = _trimNonNumeric(cardNumber);
            return _IIN.masterCard.test(cardNumber);
        } else {
            return false;
        }
    };

    /**
     * is.discover
     *
     * Validate if credit card number
     * matches Discover card.
     *
     * @param {String} cardNumber
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.discover = function validateDiscover(cardNumber) {
        if (this.creditCard(cardNumber)) {
            var cardDigits = _trimNonNumeric(cardNumber);
            return _IIN.discover.test(cardNumber);
        } else {
            return false;
        }
    };

    /**
     * is.email
     *
     * Validate if email matches RFC 5322 RFC 5321 and RFC 3696.
     *
     * Read more about email syntax at:
     * https://en.wikipedia.org/wiki/Email_address#Syntax
     *
     * @param {String} email
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.email = function validateEmailAddress(email) {
        return _doIfString(email, _processEmailValidation.bind(is));

        // Based on wikipedia article email syntax contain max 64
        // characters in local part and max 255 in domain.
        function _processEmailValidation() {
            if (this.max(_trim(email).length, 320)) {
                var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s"]+)*)|(".+"))@(\[?([a-zA-Z0-9]*)(-?\.?[a-zA-Z0-9:])*\]?)$/gi;
                return emailPattern.test(email);
            } else {
                return false;
            }
        }
    };

    /**
     * is.url
     *
     * Validate if valid http/https url string.
     *
     * @param {String} address
     * @returns {Boolean}
     * @version 0.4.0
     */
    is.url = function validateUrlAddress(address) {
        _doIfString(address, function performValidation() {
            var urlPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i;
            return urlPattern.test(address);
        });
    };

    /**
     * _fail
     *
     * Throws new error with message.
     *
     * @private
     * @param {String} msg
     * @return void.
     * @version 0.3.0
     */
    function _fail(msg) {
        throw new Error(msg.toString());
    }

    /**
     * _error
     *
     * Print error message without aborting script.
     *
     * @private
     * @param {String} msg
     * @return void.
     * @version 0.3.0
     */
    function _error(msg) {
        console.error(msg.toString());
    }

    /**
     * _type
     *
     * Returns type of provided value.
     *
     * @private
     * @param {any} value
     * @returns {String}
     * @version 0.3.0
     */
    function _type(value) {
        return typeof value;
    }

    /**
     *  _curry
     *
     *  Currying refers to the process of transforming a function with multiple arity
     *  into the same function with less arity. The curried effect is achieved by binding
     *  some of the arguments to the first function invoke,
     *  so that those values are fixed for the next invocation.
     *
     *  https://en.wikipedia.org/wiki/Currying
     *
     * @private
     * @param {Function} fn
     * @returns {Function | Error}
     * @version 0.3.0
     */
    function _curry(fn) {
        if (is.function(fn)) {
            var args = _toArray(arguments, 1);
            return function takeMissingArguments() {
                return fn.apply(this, args.concat(_toArray(arguments)));
            };
        } else {
            _fail('Function expected "function" as first argument but instead got ' + _type(fn));
        }
    }

    /**
     * _every
     *
     * Iterate trough array and validate if every element
     * meets condition provided as callback function.
     *
     * In condition function 3 parameters will be
     * passed.
     * 1. Item of iteration.
     * 2. Index of current item.
     * 3. Copy of original array.
     *
     * Copy has been made since arrays are refered
     * by link and not by value to prevent immutability
     * of original array.
     *
     * @private
     * @param {Array} array
     * @param {Function} condition
     * @return {Boolean | Error}
     * @version 0.3.0
     */
    function _every(condition, array) {
        if (is.array(array) && is.function(condition)) {
            var origArray = _copyArray(array);
            for (var i = 0; i < array.length; i++) {
                if (!condition(array[i], i, origArray)) {
                    return false;
                }
            }
            return true;
        } else {
            _fail('Arguments provided are not valid.');
        }
    }

    /**
     * _toArray
     *
     * Convert ArrayLike object to Array.
     *
     * @private
     * @param {Object | Array} arrayLike
     * @param {Number} sliceStart
     * @param {Number} sliceEnd
     * @return {Array | Error}
     * @version 0.3.0
     */
    function _toArray(arrayLike, sliceStart, sliceEnd) {
        if (is.arrayLike(arrayLike)) {
            sliceStart = sliceStart || 0;
            sliceEnd = sliceEnd || void 0;
            return Array.prototype.slice.call(arrayLike, sliceStart, sliceEnd);
        } else {
            _fail('Unable to convert to array non array like object.');
        }
    }

    /**
     * _copyArray
     *
     * Create copy of existing array.
     *
     * @private
     * @param {Array} array
     * @returns {Array | Error}
     * @version 0.3.0
     */
    function _copyArray(array) {
        return _doIfArray(array, function copyArr() {
            return [].concat(array);
        });
    }

    /**
     * _couldBeCreditCard
     *
     * Validate if length of string matches
     * the range of credit card IIN from 12 - 19
     * based on wikipedia Payment Card Number article.
     *
     * Maestro: min-length 12
     *
     * More on:
     * https://en.wikipedia.org/wiki/Payment_card_number#Issuer_identification_number_(IIN)
     *
     * @private
     * @param {String} value
     * @returns {Boolean}
     * @version 0.4.0
     */
    function _couldBeCreditCard(value) {
        return _doIfString(value, function validateCreditCardLength() {
            // Replace all non numeric characters from string to get proper length.
            return is.inNumberRangeIncluding(_trimNonNumeric(value).length, 12, 19);
        });
    }

    /**
     * _trimNonNumeric
     *
     * Replace all characters that are not in
     * range from 0 - 9 from a string.
     *
     * @private
     * @param {String} value
     * @returns {String}
     * @version 0.4.0
     */
    function _trimNonNumeric(value) {
        return _doIfString(value, function trim() {
            return value.replace(/\D+/g, '');
        });
    }

    /**
     * _doIf
     *
     * Utility function that execute callback
     * if value matches questioned type.
     *
     * Base of curried functions
     *
     * _doIfString;
     *
     * _doIfArray;
     *
     * _doIfFunction
     *
     * @param {String} type
     * @param {any} value
     * @param {Function} callback
     * @returns {any}
     * @version 0.4.0
     */
    function _doIf(type, value, callback) {
        if (is[type](value)) {
            return callback(value);
        } else {
            _fail('Invalid data provided. Expected a ' + type + ', but got a ' + _type(value));
        }
    }

    /**
     * _doIfString
     *
     * Execute callback function if value
     * if string. Curried from function _doIf
     *
     *
     * @private
     * @version 0.4.0
     */
    var _doIfString = _curry(_doIf, 'string');

    /**
     * _doIfString
     *
     * Execute callback function if value
     * if array. Curried from function _doIf
     *
     * @private
     * @version 0.4.0
     */
    var _doIfArray = _curry(_doIf, 'array');

    /**
     * _doIfFunction
     *
     * Execute callback function if value
     * is function. Curried from function _doIf
     *
     * @private
     * @version 0.4.0
     */
    var _doIfFunction = _curry(_doIf, 'function');

    /**
     * _doIfObject
     *
     * Execute callback function if value
     * is object. Curried from function _doIf
     *
     * @private
     * @version 0.5.0
     */
    var _doIfObject = _curry(_doIf, 'object');

    /**
     * _argumentsAreNumbers
     *
     * Validates that all provided arguments
     * are numbers.
     *
     * @private
     * @param {Array}
     * @return {Boolean}
     * @version 0.3.0
     */
    var _argumentsAreNumbers = _curry(_every, is.number.bind(is));

    /**
     * _each
     *
     * Iterate through array or array like object
     * and execute callback function within each
     * iteration with arguments:
     *
     * 1. Item
     * 2. Index of current item
     * 3. Original array
     *
     * @param {Function} callback
     * @param {Array} array
     * @returns {void}
     * @version 0.4.0
     */
    function _each(callback, array) {
        if (is.arrayLike(array) && is.function(callback)) {
            var origArr = _copyArray(array);
            for (var i = 0; i < array.length; i++) {
                // Callback :: item, index, iteration, origArray
                callback(array[i], i, i + 1, origArr);
            }
        } else {
            _fail('Invalid arguments provided to _each function.');
        }
    }

    /**
     * _eachReversed
     *
     * Iterate backwards through array or array like object
     * and execute callback function within each
     * iteration with arguments:
     *
     * 1. Item
     * 2. Index of current item
     * 3. Original array
     *
     * @author Stefan Lazarevic <stefanlazarevic.contact@gmail.com>
     * @param {Function} callback
     * @param {Array} array
     * @returns {void}
     * @version 0.4.0
     */
    function _eachReversed(callback, array) {
        if (is.arrayLike(array) && is.function(callback)) {
            var origArr = _copyArray(array);
            var iteration = 1;
            for (var i = array.length - 1; i > -1; i--) {
                callback(array[i], i, iteration, origArr);
                iteration++;
            }
        } else {
            _fail('Invalid arguments provided to _each function.');
        }
    }

    /**
     * _map
     *
     * Iterate over each item in array
     * and created new array with modified
     * items from original array.
     *
     * @param {Function} callback
     * @param {Array} array
     * @returns {Array}
     * @version 0.4.0
     */
    function _map(callback, array) {
        var mappedArray = [];
        _each(function mapItem(item) {
            mappedArray.push(callback(item));
        }, array);
        return mappedArray;
    }

    /**
     * _stringToNumber
     *
     * Convert string to representing number.
     *
     * TODO: Allow only numeric strings.
     *
     * @param {String} value
     * @returns {Number}
     * @version 0.4.0
     */
    function _stringToNumber(value) {
        return _doIfString(value, function convert(value) {
            return +value; // implicit to number coercion
        });
    }

    /**
     * _mapStringToNumber
     *
     * Convert every string number from array
     * to corresponding number value.
     *
     * @private
     * @version 0.4.0
     */
    var _mapStringToNumber = _curry(_map, _stringToNumber);

    /**
     * _compose
     *
     * Function composition is the process of combining two or more functions
     * to produce new function. Composed function take data and process it
     * through all pipes from right to left producing new data. (f o g) => f(g(o));
     *
     * https://en.wikipedia.org/wiki/Function_composition_(computer_science)
     *
     * @param {Function}
     * @return {Function}
     * @version 0.4.0
     */
    function _compose() {
        var functions = arguments;
        var index = functions.length;
        return function composeValue(value) {
            --index;
            return (index > -1) ? composeValue(functions[index](value)) : value;
        };
    }

    /**
     * _trim
     *
     * Removes leading and trailing whitespaces from a string.
     *
     * @param {String} str
     * @returns {String} str
     * @version 0.4.0
     */
    function _trim(str) {
        return str.trim();
    }

    /**
     * Helper function for functional switch / if else replacement.
     * @param {*} x
     * @private
     * @version 0.5.0
     */
    function matched(x) {
        return {
            on: function on() {
                return matched(x);
            },
            otherwise: function otherwise() {
                return x;
            }
        };
    }

    /**
     * Functional switch / if else replacement
     * @param {Function} predicate
     * @param {Function} fn
     * @version 0.5.0
     */
    function _match(x) {
        return {
            on: function on(pred, fn) {
                return pred(x) ? matched(fn(x)) : _match(x);
            },
            otherwise: function otherwise(fn) {
                return fn(x);
            }
        };
    }

    /**
     * Looks through each value in the list,
     * returning the first one that passes a truth test.
     * @version 0.5.0
     */
    function _find(fn, array) {
        return _doIfFunction(fn, function findInArray() {
            _each(function searchForValue(item) {
                if (is.inArray(fn(item))) {
                    return item;
                }
            }, array);
        });
    }

    /**
     * Extract a property value of an object.
     * @param {String} key
     * @param {Object} object
     * @return {*} object[key]
     * @version 0.5.0
     */
    function _pluck(key, object) {
        return _doIfObject(object, function getObjectValue() {
            return object[key];
        });
    }

    /**
     * Looks through each value in the list, returning an array of all the values that pass a predicate test.
     * @param {Function} fn
     * @param {Array} arr
     * @return {Array} filtered
     * @version 0.5.0
     */
    function _filter(fn, arr) {
        return _doIfArray(arr, function() {
            var filtered = [];
            _each(function checkPredicate(item, index, arr) {
                if (fn(item, index, arr)) {
                    filtered.push(item);
                }
            }, arr);
            return filtered;
        });
    }

    /**
     * Convert any value to a string.
     * @notTested
     * @param {*} value
     * @return {String} value
     * @version 0.5.0
     */
    function _toString(value) {
        return is.Object(value) ? JSON.stringify(value) : value.toString();
    }

    /**
     * Retrieve all the names of the object's own enumerable properties.
     * @param {*} list
     * @return {Array | Error} keys
     * @version 0.5.0
     */
    function _keys(list) {
        var _keys = [];
        if (is.arrayLike(list)) {
            for (var key in arr) {
                if (Object.prototype.hasOwnProperty.call(arr, key)) {
                    _keys.push(key);
                }
            }
            return _keys;
        } else {
            _fail('List is not array like.');
        }
    }

    /**
     * Produces a duplicate-free version of the array.
     * @param {Array} array
     * @return {Array} unique
     * @version 0.5.0
     */
    function _unique(array) {
        return _doIfArray(array, function filterArray() {
            return _filter(function filterUniqueValues(value, index) {
                return is.something(value) && array.indexOf(value) === index;
            }, array);
        });
    }

    /**
     * Immutable FIFO, LIFO
     * @author Stefan Lazarevic <stefanlazarevic.contact@gmail.com>
     * @version 0.5.0
     */
    function _unshift(arr, item) {
        return _doIfArray(arr, function shift() {
            return [].concat(item, arr);
        });
    }

    function _push(arr, item) {
        return _doIfArray(arr, function shift() {
            return [].concat(arr, item);
        });
    }

    function _shift(arr) {
        return _doIfArray(arr, function shift() {
            return arr.slice(1);
        });
    }

    function _pop(arr) {
        return _doIfArray(arr, function shift() {
            return arr.slice(0, -1);
        });
    }

    /**
     * Creates a version of the function that can only be called one time.
     * @param {Function} fn
     * @return {Function}
     * @version 0.5.0
     */
    function once(fn) {
        var _done = false;
        return function () {
            return _done ? void 0 : (_done = true, fn.apply(this, arguments));
        };
    }

    /**
     * @private
     * @param {Error} error
     * @version 0.5.0
     */
    function _stackCatch(error) {
        console.error(error);
        window.open("http://stackoverflow.com/search?q=[js]" + error, "_blank");
    }

    /**
     * Return negation of provided boolean value.
     * Helper function to reduce unreadable code such as
     * if (!somerandomfunctioncall())
     *
     * above line can be written
     * if (not(somerandomfunctioncall()))
     *
     * @param {*} value
     * @version 0.5.0
     */
    function not(value) {
        return !value;
    }

    /**
     * Stackoverflow try catch wrapper.
     * @param {Function} fn
     * @version 0.5.0
     */
    function couldFail(fn) {
        try {
            fn();
        } catch (err) {
            _stackCatch(err);
        }
    }

    var _ = {
        VERSION: VERSION,
        fail: _fail,
        error: _error,
        type: _type,
        curry: _curry,
        every: _every,
        toArray: _toArray,
        copyArray: _copyArray,
        each: _each,
        eachR: _eachReversed,
        map: _map,
        stringToNumber: _stringToNumber,
        compose: _compose,
        trim: _trim,
        match: _match,
        find: _find,
        pluck: _pluck,
        filter: _filter,
        toString: _toString,
        keys: _keys,
        unique: _unique,
        unshift: _unshift,
        push: _push,
        shift: _shift,
        pop: _pop,
        once: once,
        couldFail: couldFail
    };

	/**
     * Object.create is supported on IE9+.
     * For <= IE8 use polyfill;
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
     */
    global.is = Object.create(is);
    global.jse = global.functional = _;

	/**
     * On Node.js export object as module.
     */
    if (is.defined(typeof module)) {
        module.exports = is;
        module.exports = _;
    }

    /**
     * @author Stefan Lazarevic <stefanlazarevic.contact@gmail.com>
     */

}(typeof window !== 'undefined' ? window : global));
