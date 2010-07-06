(function( $, window, undefined ) {

window.JOE = Class.$extend({
    /** JOE(http://alankang.tistory.com/137) implement for Classy and jQuery.

    Define the "name" class.

        >>> var Name = JOE.$extend({
        ...     $map: {
        ...         first: [".first"],
        ...         last: [".last"]
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
        ...         name: [".name", Name],
        ...         age: [".age", Number],
        ...         profile: [".profile", "src"]
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
        ...         head: [".head .person", Person],
        ...         members: [".members .person", [Person]]
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

    */

    /** Getter/Setter

    Define a class

        >>> var HasProperty = JOE.$extend({
        ...     $map: {
        ...         text: [null, "text", {
        ...             get: function( val ) {
        ...                 return "^" + val + "$";
        ...             },
        ...             set: function( val ) {
        ...                 return val.replace( /^\^|\$$/g, "" );
        ...             }
        ...         }]
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
                if ( val === undefined ) {
                    var val = this.__data__[ prop ],
                        result = this[ prop ].$desc.getter.call( this, val );
                    if ( result !== false && result !== undefined ) {
                        val = result;
                    }
                    return val;
                } else {
                    var result = this[ prop ].$desc.setter.call( this, val );
                    if ( result === false ) {
                        return this;
                    } else if ( result !== undefined ) {
                        val = result;
                    }
                    this.__data__[ prop ] = val;
                    this[ prop ].$set( this.$attached, val );
                    return this;
                }
            };
        };
        var desc, selector, type, attr, isArray;
        for ( var prop in this.$map ) {
            desc = this.$map[ prop ],
            type = attr = undefined,
            getter = setter = function() {},
            isArray = false;
            for ( var i = 1; i < desc.length; i++ ) {
                if ( $.isFunction( desc[ i ] ) ) {
                    isArray = false;
                    type = desc[ i ];
                } else if ( $.isArray( desc[ i ] ) ) {
                    isArray = true;
                    type = desc[ i ][ 0 ];
                } else if ( $.isPlainObject( desc[ i ] ) ) {
                    getter = desc[ i ].get || getter;
                    setter = desc[ i ].set || setter;
                } else if ( typeof desc[ i ] === "string" ) {
                    attr = desc[ i ];
                }
            }

            selector = desc[ 0 ] || null,
            attr = attr || "text",
            type = type || String;

            this[ prop ] = property( prop );

            this[ prop ].$desc = {
                selector: selector,
                attr: attr,
                type: type,
                isArray: isArray,
                getter: getter,
                setter: setter
            };
            this[ prop ].$select = $.proxy(function( elem ) {
                var fn = this[ 0 ][ this[ 1 ] ];
                elem = $( elem );
                if ( fn.$desc.selector ) {
                    return elem.find( fn.$desc.selector );
                } else {
                    return elem;
                }
            }, [ this, prop ] );
            this[ prop ].$get = $.proxy(function( elem ) {
                var fn = this[ 0 ][ this[ 1 ] ],
                    attr = fn.$desc.attr,
                    type = fn.$desc.type,
                    isArray = fn.$desc.isArray,
                    cast = function( elem ) {
                        if ( type.prototype.__proto__ === JOE.prototype ) {
                            return type.from( elem );
                        } else {
                            if ( JOE.isAttr( attr ) ) {
                                return type( elem.attr( attr ) );
                            } else {
                                return type( elem[ attr ]() );
                            }
                        }
                    };
                elem = fn.$select( elem );
                if ( isArray ) {
                    var arr = elem.map(function() {
                        return cast( this );
                    }).get();
                    arr.remove = function( index ) {
                        var obj = this[ index ];
                        delete this[ index ];
                        obj.removeElem();
                        return obj;
                    };
                    arr.add = function( obj ) {
                        this.push( obj );
                        return obj;
                    };
                    return arr;
                } else {
                    return cast( elem );
                }
            }, [ this, prop ] );
            this[ prop ].$set = $.proxy(function( elem, val ) {
                var fn = this[ 0 ][ this[ 1 ] ];
                elem = fn.$select( elem );
                if ( JOE.isAttr( fn.$desc.attr ) ) {
                    return elem.attr( fn.$desc.attr, val );
                } else {
                    return elem[ fn.$desc.attr ]( val );
                }
            }, [ this, prop ] );
        }
    },
    attach: function( elem ) {
        this.$attached = this.$attached.add( elem );
        for ( var prop in this.$map ) {
            this[ prop ].$set( this.$attached, this.__data__[ prop ] );
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
            elem = $( elem );
            obj.$attached = obj.$attached.add( elem );
            for ( var prop in obj.$map ) {
                obj.__data__[ prop ] = obj[ prop ].$get( elem );
            }
            return obj;
        },
        isAttr: function( attr ) {
            return attr !== "html" && attr !== "text";
        }
    }
});

})( jQuery, this );
