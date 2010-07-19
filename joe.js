/**
JOE(http://alankang.tistory.com/137) implement for Classy and jQuery.
*/
(function( $, window, undefined ) {

var JOE = Class.$extend({
    /** .. class:: JOE

    Define the "name" class.

        >>> var Name = JOE.$extend({
        ...     $map: {
        ...         first: JOE.find( ".first" ),
        ...         last: JOE.find( ".last" )
        ...     },
        ...     $template: '\
        ...       <p class="name"> \
        ...         <span class="first"><%=this.first() %></span> \
        ...         <span class="last"><%=this.last() %></span> \
        ...       </p>'
        ... });

    Markups.

        >>> var name_html = '\
        ...   <p class="name"> \
        ...     <span class="first">Heungsub</span> \
        ...     <span class="last">Lee</span> \
        ...   </p>';
        >>> var name_elem = $( name_html );

    Make an instance from markup.

        >>> var n = Name.from( name_elem );
        >>> console.log( name_elem.data( "joe" ) );
        >>> name_elem.data( "joe" ) === n;
        true
        >>> n.first();
        Heungsub
        >>> n.last();
        Lee
        >>> n.$attached.length;
        1
        >>> n.first( "Mario" );
        [object Object]
        >>> name_elem.text(); //doctest: +NORMALIZE_WHITESPACE
        Mario Lee

    Attach another element.

        >>> var name_elem2 = $( name_html );
        >>> n.attach( name_elem2 );
        [object Object]
        >>> name_elem2.data( "joe" ) === n;
        true
        >>> n.$attached.length;
        2
        >>> n.last( "Super" );
        [object Object]
        >>> name_elem.text(); //doctest: +NORMALIZE_WHITESPACE
        Mario Super
        >>> name_elem2.text(); //doctest: +NORMALIZE_WHITESPACE
        Mario Super

    Detach one.

        >>> n.detach( name_elem2 );
        [object Object]
        >>> n.$attached.length;
        1
        >>> n.first( "Yesol" ).last( "Joo" );
        [object Object]
        >>> name_elem.text(); //doctest: +NORMALIZE_WHITESPACE
        Yesol Joo
        >>> name_elem2.text(); //doctest: +NORMALIZE_WHITESPACE
        Mario Super

    Define the "Person" class.

        >>> var Person = JOE.$extend({
        ...     $map: {
        ...         name: JOE.find( ".name" ).as( Name ),
        ...         age: JOE.find( ".age" ).as( Number ),
        ...         profile: JOE.find( ".profile" ).attr( "src" )
        ...     },
        ...     older: function() {
        ...         this.age( this.age() + 1 );
        ...         return this;
        ...     },
        ...     $template: '\
        ...       <div class="person"> \
        ...         <%=this.name().toHTML() %> \
        ...         <p class="age"><%=this.age() %></p> \
        ...         <p><img class="profile" src="<%=this.profile() %>" /></p> \
        ...       </div>'
        ... });

    Markups.

        >>> var person_html = '\
        ...   <div class="person">' + name_html + '\
        ...     <p class="age">20</p> \
        ...     <p><img class="profile" src="heungsub.jpg" /></p> \
        ...   </div>';
        >>> var person_elem = $( person_html );

    Make an instance from markup.

        >>> var p = Person.from( person_elem );
        >>> p.name() instanceof Name;
        true
        >>> p.name().first();
        Heungsub
        >>> p.name().last();
        Lee
        >>> p.age();
        20
        >>> p.profile();
        heungsub.jpg

    Also the object is in the element storage.

        >>> person_elem.data( "joe" ) === p;
        true
        >>> person_elem.find( ".name" ).data( "joe" ) === p.name();
        true

    Replaces a name.

        >>> p.name( Name({ first: "new", last: "name" }) );
        [object Object]
        >>> p.name().first();
        new
        >>> p.name().last();
        name

    Custom method.

        >>> p.older();
        [object Object]
        >>> p.age();
        21
        >>> person_elem.find( ".age" ).text();
        21

    Define the "Family" class.

        >>> var Family = JOE.$extend({
        ...     $map: {
        ...         head: JOE.find( ".head .person" ).as( Person ),
        ...         members: JOE.find( ".members .person" ).asArray( Person )
        ...     },
        ...     $template: '\
        ...       <div class="family"> \
        ...         <div class="head"><%=this.person().toHTML() %></div> \
        ...         <div class="members"> \
        ...           <% var members = this.members(); %> \
        ...           <% for ( var i in members ) { %> \
        ...              <%=members[ i ].toHTML() %> \
        ...           <% } %> \
        ...         </div> \
        ...       </div>'
        ... });

    Markups.

        >>> var family_html = '\
        ...   <div class="family"> \
        ...     <div class="head">' + person_html + '</div> \
        ...     <div class="members"> \
        ...       <div class="person"> \
        ...         <p class="name"> \
        ...           <span class="first">Yesol</span> \
        ...           <span class="last">Joo</span> \
        ...         </p> \
        ...         <p class="age">18</p> \
        ...         <p><img class="profile" src="yesol.jpg" /></p> \
        ...       </div> \
        ...       <div class="person"> \
        ...         <p class="name"> \
        ...           <span class="first">Yoonwoo</span> \
        ...           <span class="last">Lee</span> \
        ...         </p> \
        ...         <p class="age">-10</p> \
        ...         <p><img class="profile" src="yoonwoo.jpg" /></p> \
        ...       </div> \
        ...     </div> \
        ...   </div>';
        >>> var family_elem = $( family_html );

    Make an instance from markup.

        >>> var f = Family.from( family_elem );
        >>> f.head() instanceof Person;
        true
        >>> f.head().age();
        20
        >>> f.head().name().first();
        Heungsub

    Array

        >>> $.isArray( f.members() );
        true
        >>> f.members().length;
        2
        >>> f.members()[ 0 ] instanceof Person;
        true
        >>> f.members()[ 0 ].name().first();
        Yesol
        >>> f.members()[ 1 ].age();
        -10
        >>> f.members()[ 1 ].older();
        [object Object]
        >>> f.members()[ 1 ].age();
        -9
        >>> family_elem.find( ".members .person:eq(1) .age" ).text();
        -9
        >>> f.members( 0 ) instanceof Person;
        true
        >>> f.members( 0 ).name().first();
        Yesol

    Remove an item

        >>> f.members().length;
        2
        >>> family_elem.find( ".members .person" ).length;
        2
        >>> f.members().remove( 0 );
        [object Object]
        >>> family_elem.find( ".members .person" ).length;
        1

    Add new item

        >>> f.members().add( Person({
        ...     name: Name({ first: "Yesol", last: "Joo" }),
        ...     age: 20,
        ...     profile: "yesol.jpg"
        ... }) );
        [object Object]
        >>> f.members().length;
        3
        >>> family_elem.find( ".members .person" ).length; //doctest: +SKIP
        2

    Get as pure object

        >>> var o = f.toObject();
        >>> o.head.name.first;
        Heungsub
        >>> o.members[ 1 ].age;
        20

    Get as html

        >>> f.head().name().toHTML(); //doctest: +NORMALIZE_WHITESPACE
        <p class="name">
          <span class="first">Heungsub</span>
          <span class="last">Lee</span>
        </p>
        >>> f.head().toHTML(); //doctest: +NORMALIZE_WHITESPACE
        <div class="person">
          <p class="name">
            <span class="first">Heungsub</span>
            <span class="last">Lee</span>
          </p>
          <p class="age">20</p>
          <p><img class="profile" src="heungsub.jpg" /></p>
        </div>

    Replace members

        >>> f.members([
        ...     Person({
        ...         name: Name({ first: "1", last: "2" }),
        ...         age: 3,
        ...         progile: "4"
        ...     }),
        ...     Person({
        ...         name: Name({ first: "5", last: "6" }),
        ...         age: 7,
        ...         progile: "8"
        ...     })
        ... ]);
        [object Object]
        >>> f.members().length;
        2
        >>> f.members()[ 0 ].age();
        3
        >>> f.members().add( p )
        [object Object]
        >>> f.members().length;
        3
        >>> f.members()[ 2 ].age();
        21

    */

    /** Getter/Setter

    Define a class

        >>> var HasProperty = JOE.$extend({
        ...     $map: {
        ...         text: JOE.text().bind({
        ...             get: function( val ) {
        ...                 return "^" + val + "$";
        ...             },
        ...             set: function( val ) {
        ...                 return val.replace( /^\^|\$$/g, "" );
        ...             }
        ...         })
        ...     }
        ... });

    Markups.

        >>> var property_html = '<p class="has-property">TEST</p>';
        >>> var property_elem = $( property_html );

    Attach.

        >>> var hp = HasProperty.from( property_elem );
        >>> hp.text();
        ^TEST$
        >>> hp.text( "^HELLO$" );
        [object Object]
        >>> hp.text();
        ^HELLO$
        >>> property_elem.text();
        HELLO
    */
    $map: {},
    $attached: $(),
    __init__: function( data ) {
        this.__data__ = data || {};
        var property = function( prop ) {
            return function( val ) {
                var isInt = String( parseInt( val ) ) !== "NaN";
                if ( isInt && this[ prop ].$field.isArray ) {
                    return this[ prop ]()[ val ];
                } else if ( val === undefined ) {
                    var val = this.__data__[ prop ],
                        getter = this[ prop ].$field.events.get,
                        result = getter.call( this, val );
                    if ( result !== false && result !== undefined ) {
                        val = result;
                    }
                    return val;
                } else {
                    var setter = this[ prop ].$field.events.set,
                        result = setter.call( this, val );
                    if ( result === false ) {
                        return this;
                    } else if ( result !== undefined ) {
                        val = result;
                    }
                    if ( this[ prop ].$field.isArray ) {
                        val.add = this.__data__[ prop ].add,
                        val.remove = this.__data__[ prop ].remove;
                    }
                    this.__data__[ prop ] = val;
                    this[ prop ].$field.set( this.$attached, val );
                    return this;
                }
            };
        };
        for ( var prop in this.$map ) {
            this[ prop ] = property( prop );
            this[ prop ].$field= this.$map[ prop ];
        }
    },
    attach: function( elem, reversed ) {
        this.$attached = this.$attached.add( elem );
        this.$attached.data( "joe", this );
        for ( var prop in this.$map ) {
            if ( reversed ) {
                this.__data__[ prop ] = this[ prop ].$field.get( elem );
            } else {
                this[ prop ].$field.set( this.$attached, this.__data__[ prop ] );
            }
        }
        return this;
    },
    detach: function( elem ) {
        if ( elem === undefined ) {
            this.$attached = $();
        } else {
            this.$attached = this.$attached.not( elem );
        }
        return this;
    },
    removeElem: function() {
        this.$attached.remove();
        return this;
    },
    toObject: function() {
        var obj = $.extend( {}, this.__data__ );
        for ( var k in obj ) {
            if ( obj[ k ] instanceof JOE ) {
                obj[ k ] = obj[ k ].toObject();
            } else if ( $.isArray( obj[ k ] ) ) {
                var arr = [];
                for ( var i in obj[ k ] ) {
                    if ( obj[ k ][ i ] instanceof JOE ) {
                        arr.push( obj[ k ][ i ].toObject() );
                    }
                }
                obj[ k ] = arr;
            }
        }
        return obj;
    },
    toHTML: function() {
        return $.jqote( this.$template, $.extend( {}, this ) );
    },
    __classvars__: {
        from: function( elem ) {
            var obj = new this();
            obj.attach( elem, true );
            return obj;
        },
        isAttr: function( attr ) {
            return attr !== "html" && attr !== "text";
        }
    }
});

/** .. class:: JOE.Field

Mapping field chaining.

    >>> var chain = JOE.find( "section h" ).find( "a" );
    >>> chain.get( document.body );
    joe.js
    >>> chain.set( document.body, "Field test done." );
    [object Object]
    >>> chain.get( document.body );
    Field test done.
*/
JOE.Field = function( method, arguments ) {
    this.chain = [];
    this.isArray = false;
    this.type = String;
    this[ this.defaultAttribute ]();
    this[ method ].apply( this, arguments );
    return this;
};

JOE.Field.prototype = {
    traversing: [ "find" ],
    attributes: [ "attr", "html", "text" ],
    defaultAttribute: "text",

    events: {
        get: $.noop,
        set: $.noop
    },

    select: function( elem ) {
        var call;
        elem = $( elem );
        for ( var i = 0; i < this.chain.length; i++ ) {
            call = this.chain[ i ];
            elem = elem[ call.method ].apply( elem, call.arguments );
        }
        return elem;
    },
    get: function( elem ) {
        elem = this.select( elem );
        var call = this.attribute,
            type = this.type,
            cast = function( elem, type ) {
                elem = $( elem );
                if ( type.prototype.__proto__ === JOE.prototype ) {
                    return type.from( elem );
                } else {
                    var v = elem[ call.method ].apply( elem, call.arguments );
                    return type( v );
                }
            };
        if ( this.isArray ) {
            var arr = elem.map(function() {
                return cast( this, type );
            }).get();
            arr.add = function( obj ) {
                this.push( obj );
                return obj;
            };
            arr.remove = function( index ) {
                var obj = this[ index ];
                delete this[ index ];
                obj.removeElem();
                return obj;
            };
            return arr;
        } else {
            return cast( elem, type );
        }
    },
    set: function( elem, val ) {
        elem = this.select( elem );
        var call = this.attribute,
            args = [];
        for ( var i = 0; i < call.arguments.length; i++ ) {
            args.push( call.arguments[ i ] );
        }
        args.push( val );
        return elem[ call.method ].apply( elem, args );
    },
    bind: function( events ) {
        this.events = $.extend( {}, this.events, events );
        return this;
    },
    as: function( type ) {
        this.type = type;
        return this;
    },
    asArray: function( type ) {
        this.isArray = true;
        this.type = type;
        return this;
    }
};
JOE.Field.methods = $.merge(
    JOE.Field.prototype.traversing,
    JOE.Field.prototype.attributes
);

$.each( JOE.Field.methods, function() {
    var method = String( this );
    JOE[ method ] = function() {
        return new this.Field( method, arguments );
    };
    JOE.Field.prototype[ method ] = function() {
        var call = {
            method: method,
            arguments: arguments
        };
        if ( $.inArray( method, this.attributes ) < 0 ) {
            this.chain.push(call);
        } else {
            this.attribute = call;
        }
        return this;
    };
});

window.JOE = JOE;

})( jQuery, this );
