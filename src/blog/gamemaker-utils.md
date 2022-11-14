---
title: "GameMaker Scripts"
author: gleeson
date: 2022-09-29
tags: ['gamemaker','code']
---

Here is my collection of useful functions I use in multiple GameMaker projects.



### function()

description.

```gml


```

---

<details>
	<summary><h2>General Functions</h2></summary>

General functions.

### Macros

```gml
#macro key_press		keyboard_check_pressed
#macro key_held			keyboard_check
#macro key_release		keyboard_check_released

#macro mouse_press		mouse_check_button_pressed
#macro mouse_held		mouse_check_button
#macro mouse_release	mouse_check_button_released

#macro DATETIME_NOW		date_datetime_string(date_current_datetime())

#macro struct_get		variable_struct_get
#macro struct_names		variable_struct_get_names
#macro struct_length	variable_struct_names_count
#macro struct_set		variable_struct_set
#macro struct_exists	variable_struct_exists

#macro console			show_debug_message

```

### single_object()

description.

```gml
function single_object() {
	if (instance_number(object_index) > 1) {instance_destroy();}
}

if (drawDebug) {
	// Canvas
	draw_text(canvasBbox.x1, canvasBbox.y1,"Canvas");
	draw_rect(canvasBbox.x1, canvasBbox.y1, canvasBbox.x2, canvasBbox.y2, c_fuchsia, 0.2, false);
	draw_rect(canvasBbox.x1, canvasBbox.y1, canvasBbox.x2, canvasBbox.y2, c_fuchsia, 1.0, true);
}

```

### create()

description.

```gml
function create(instance) {
	return instance_create_depth(x,y,depth,instance);	
}
```

### instance_get_name()

description.

```gml
function instance_get_name(_id) {
	return object_get_name(_id.object_index) + "(" + string(_id) + ")";
}
```

### forof()

description.

```gml
// NOTE: Callback MUST be a function receiving three arguments: function(struct,k,v) {}
function forof(_struct, _callback) {
	var k,v,i = 0;
	var _prop	= struct_names(_struct);
	var _len	= struct_length(_struct);
	repeat(_len) {
		k = _prop[i++];
		v = _struct[$ k];
		_callback(_struct,k,v);
	}
}
```

#### Usage

```gml

```

### string_concat()

description.

```gml
function string_concat() {
	var output = "";
	for (var i = 0; i < argument_count; i++) {
		output += string(argument[i]);
	}
	return output;
}
```

#### Usage

```gml

```

---
</details>

## Math Functions

Math functions.

### approach()

description.

```gml
function approach(_val,_target,_inc) {
	if _val < _target	{return min(_val+_inc,_target);}
	else				{return max(_val-_inc,_target);}
}
```

### wrap()

description.

```gml
function wrap(_val,_min,_max) {
	var _mod = (_val-_min) mod (_max-_min);
	if ( _mod < 0 ) {return (_mod + _max);} 
	else			{return (_mod + _min);}
}

```

### invlerp()

description.

```gml
function invlerp(_min,_max,_val) {
	return (_val-_min) / (_max-_min);
}

```

### chance()

description.

```gml
function chance(_percent) {
	return (irandom(99) < _percent);
}
```

### inside()

description.

```gml
function inside(_val,_min,_max) {
	return (_val >= _min and _val <= _max);
}
```

### **Spring()**

**Spring** is a 'class' that lets you make springy values!

> **NOTE** Spring() makes use of the [Delta](#Delta) functions.

```gml
function Spring(_val = 0, _target = 0, _spd = 0, _damp = 0.6, _factor = 0.1) constructor {
	
	value	= _val;
	target	= _target;
	spd		= _spd;
	damp	= _damp;
	factor	= _factor;
	
	static update = function() {
		spd		+= game_speed((target - value) * factor);
		value	+= game_speed(spd);
		spd		*= game_multiply(damp);
		return value;
	}
	
	static force = function(_x) {
		value	= _x;
		target	= _x;
		spd		= 0;
	}
}
```
---

## File Functions

File functions

---

## Delta Functions

Delta Functions

```gml
/// Utilities : DELTATIME
/// (Description)

global.GAMEFPS		= room_speed;
global.GAMESPEED	= 1;

// ---------------------------------------------------- //

function game_speed(_val) {
	return _val * global.GAMESPEED;
}

function game_multiply(_val) {
	return power(_val,global.GAMESPEED);
}

function game_set_fps(_fps) {
	global.GAMEFPS		= _fps;
	global.GAMESPEED	= 60 / _fps;
	game_set_speed(_fps,gamespeed_fps);
}

```

### game_speed()

description.

```gml
function game_speed(_val) {
	return _val * global.GAMESPEED;
}

```

### game_multiply()

description.

```gml
function game_multiply(_val) {
	return power(_val,global.GAMESPEED);
}

```

### game_set_fps()

description.

```gml
function game_set_fps(_fps) {
	global.GAMEFPS		= _fps;
	global.GAMESPEED	= 60 / _fps;
	game_set_speed(_fps,gamespeed_fps);
}

```
---

## Drawing Functions

> **NOTE** The following functions depend on having a Sprite asset, `sPixel`, which is a 1x1 white pixel asset. Make this yourself.

### draw_rect()

description.

```gml
function draw_rect(_l,_t,_r,_b,_col,_alpha,_outline) {
	var	_w = ceil(_r-_l), _h = ceil(_b-_t);
	if (_outline) {
		draw_sprite_ext(sPixel,0,_l,_t,_w,1,0,_col,_alpha);		// Top
		draw_sprite_ext(sPixel,0,_l,_t,1,_h,0,_col,_alpha);		// Left
		draw_sprite_ext(sPixel,0,_r,_t,1,_h+1,0,_col,_alpha);	// Right
		draw_sprite_ext(sPixel,0,_l,_b,_w+1,1,0,_col,_alpha);	// Bottom
	} else {
		draw_sprite_ext(sPixel,0,_l,_t,_w,_h,0,_col,_alpha);	
	}
}
```

### draw_crosshair()

description.

```gml
function draw_crosshair(_x,_y,_w,_h,_col,_alpha) {
	draw_sprite_ext(sPixel,0,_x-_w,_y,_w*2,1,0,_col,_alpha);
	draw_sprite_ext(sPixel,0,_x,_y-_h,1,_h*2,0,_col,_alpha);
	
	draw_text(_x, _y, string(_x) + "," + string(_y));
}
```

### draw_collision_box()

description.

```gml
function draw_collision_box(_col = c_red, _alpha = 1) {
	draw_rect(bbox_left,bbox_top,bbox_right,bbox_bottom,_col, _alpha,true);
}
```

---

That's it!