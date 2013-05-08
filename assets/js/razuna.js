/*
 * Copyright (C) 2005-2008 Razuna Ltd.
 *
 * This file is part of Razuna - Enterprise Digital Asset Management.
 *
 * Razuna is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Razuna is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero Public License for more details.
 *
 * You should have received a copy of the GNU Affero Public License
 * along with Razuna. If not, see <http://www.gnu.org/licenses/>.
 *
 * You may restribute this Program with a special exception to the terms
 * and conditions of version 3.0 of the AGPL as described in Razuna's
 * FLOSS exception. You should have received a copy of the FLOSS exception
 * along with Razuna. If not, see <http://www.razuna.com/licenses/>.
 *
 *
 * HISTORY:
 * Date US Format		User					Note
 * 2013/04/10			CF Mitrah		 	Initial version
*/ 
if ('CKEDITOR' in window) {

    (function () {
    	razunaPluginAdded = false;
    	CKEDITOR.on('instanceReady', function(){
	    	
	    	if (razunaPluginAdded == false){
	    		razunaPluginAdded = true;
				for(var instanceName in CKEDITOR.instances) {
					$targetTextArea = $(CKEDITOR.instances[instanceName].element.$)
					$parentLabel = $targetTextArea.parent().siblings('.control-label');
					aHref = '<a href=\'javascript:renderRazunaWindow("'+instanceName+'")\' class="pull-right">Razuna</a>';
					$parentLabel.append(aHref)
				}
				$('body').append('<div id="razunaModalWindow"></div>');
			}	
		});
		
	})();
	$('input[name=radio_path]').live('change',function(){
		$('#width').val(parseInt($(this).attr('data-width')));
		$('#height').val(parseInt($(this).attr('data-height')));
	});
	
	$('#search').live('click', function() {
		$("#tagTree").jstree('open_all');
		$('#inner-div').hide();
		$('#loader-div').hide();
		$('#tagTree').css("width","835px");
		$('#full_page_loader').css('display','block');
		setTimeout(function(){
			$("#tagTree").jstree("search", $('#search_box').val());
			$('#full_page_loader').css('display','none');
		}, 2000);  
	});
	$('#insert_into_post').live('click',function(){
		if ($(this).hasClass('image')) {
			if ($('.urlfield').val().length){
				url = $('.urlfield').val();
			}
			else{
				url = $("input[type='radio'][name='radio_path']:checked").val();
			}
			add_to_editor = "<a href='"+url+"'><img title='" + $('#img_title_text').val() + "' src='" + $("input[type='radio'][name='radio_path']:checked").val() + "' alt='"+$('#alt_text').val()+"'></a>";
		}
		else if ($(this).hasClass('audio')) {
			add_to_editor = "[mura]event.razunaMediaPlayer.dspMedia(file='" + $('input[type="radio"][name="radio_path"]:checked').val() + "',width=450,height=30,sharecode=true,embedlink=true)[/mura]";
		}
		else if ($(this).hasClass('video')) {
			add_to_editor = "[mura]event.razunaMediaPlayer.dspMedia(file='" + $('input[type="radio"][name="radio_path"]:checked').val() + "',width='" + $('#width').val() + "',height='" + $('#height').val() + "',image='"+$('input[type="radio"][name="radio_path"]:checked').attr('data-image-thumb')+"',sharecode=true,embedlink=true)[/mura]";
		}
		else if ($(this).hasClass('document')) {
			if ($('#doc_link_text').val() == "") {
				$('.doc_link_error').remove();
				$('#doc_link_text').css({'border':'1px solid red'}).after('<span class="doc_link_error" style="color:red;"> This field is required<span>');
				return false;
			}
			else {
				add_to_editor = "<a href = '" + $('input[type="radio"][name="radio_path"]:checked').val() + "' target='_blank'>" + $('#doc_link_text').val() + "</a>";
			}
		}
		var imgHtml = CKEDITOR.instances[$('#instances').val()].getData();
		CKEDITOR.instances[$('#instances').val()].setData(imgHtml+add_to_editor);
		removAll();
		$('#razunaModalWindow').dialog("close");
	});
	
	function removAll(){
		$('.inner-div').remove();
		$('#loader-div').hide();
		$('#search_div').remove();
		$('#tagTree').css("width","835px");
	}
	
	function renderRazunaWindow(instances){
		$('#razunaModalWindow').html('<div align="center"><img src="'+pluginFolder+'assets/images/ajax-loader.gif"></div>');
		$('#razunaModalWindow').dialog({
	        bgiframe: true,
	        autoOpen: false,
	        width: 860,
			height:450,
	        modal: true,
	        title: "Razuna plugin Test" 
       	});
		$('.ui-dialog-titlebar-close').click(function(){
			removAll();
		});
		
		$('#razunaModalWindow').load(pluginFolder+'?razunaaction=ajax',function(){
			var loader_div = '<div id="loader-div"><div align="center" class="img_div"><img src="'+pluginFolder+'assets/images/ajax-loader.gif"></div></div>';
				$('#razunaModalWindow').before(loader_div);
				$('#instances').val(instances);

		$("#tagTree").jstree({
			"plugins" : [ "json_data", "ui", "types", "search"],
			"types" : {
            	"types" : {
		                "folder" : {
		                    "hover_node" : false,
		                    "select_node" : function () {return false;}
		                },
		                "default" : {
		                    "select_node" : function (target) {
								$('#tagTree').css("width","266px");
								$('#inner-div').show();
								$('.inner-div').remove();
								$('#loader-div').show();
								var type = $(target).attr('data-kind');
								if(type == 'aud'){
									var content='<tbody><tr><td valign="top"><strong>File name : </strong><span>'+$(target).attr('data-filename_org')+'</span><br><strong>Kind : </strong><span>Audio</span><br><table border="0" id="renditions"><tr><td>&nbsp;</td><td ><div><input type="radio" checked="checked" name="radio_path" class="radio_path radio" value="'+$(target).attr('data-local_url_org')+'" id="radio_path" data-height="'+$(target).attr('data-height')+'" data-width="'+$(target).attr('data-width')+'"><label for="radio_path_orig" class="form_labels">Original</label></div></td></tr></table></td></tr><tr><td><br><button type="button" data-id="'+$(target).attr('id')+'" id="insert_into_post" class="btn audio">Insert into Post</button></td></tr></tbody>';
								}
								else if(type == 'img'){
									var none="javascript: $('.urlfield').val('');";
									var original="javascript: $('.urlfield').val($('.image-size-original').val());";
									var thumbnail="javascript: $('.urlfield').val($('.image-size-thumbnail').val());";
									var content='<tbody><tr><td><img src="'+$(target).attr('data-local_url_thumb')+'" id="show-image"></td><td valign="top"><strong>File name : </strong><span>'+$(target).attr('data-filename_org')+'</span><br><strong>Kind:</strong><span>Image</span><br><table border="0" id="renditions"><tr><td><strong>Size:</strong></td><td><div class="image-size-item"><input type="radio" checked="checked" name="radio_path" class="image-size-thumbnail radio" value="'+$(target).attr('data-local_url_thumb')+'" id="radio_path" data-height="'+$(target).attr('data-height')+'" data-width="'+$(target).attr('data-width')+'"><label for="image-size" class="form_labels">Thumbnail</label></div></td></tr><tr ><td>&nbsp;</td><td ><div class="image-size-item"><input type="radio" name="radio_path" class="image-size-original radio" value="'+$(target).attr('data-local_url_org')+'" id="radio_path"><label for="image-sizeorig" class="form_labels">Original</label></div></td></tr></table></td></tr><tr><td><strong>Alternate text:</strong></td><td><input type="text" id="alt_text" value="'+$(target).attr('data-filename_org')+'" class="alt"></td></tr><tr><td><strong>Title:</strong></td><td><input type="text" value="" id="img_title_text"></td></tr><tr><td><strong>Link URL:</strong></td><td><input type="text" class="urlfield text"></td></tr><tr><td style="text-align:center;" colspan="3"><br><button onclick="'+none+'" class="btn none">None</button>&nbsp;&nbsp;<button onclick="'+original+'" class="btn image_org">File Original Size</button>&nbsp;&nbsp;<button onclick="'+thumbnail+'" class="btn image_thumb">File Thumbnail Size</button>&nbsp;&nbsp;</td></tr><tr><td colspan="3" style="text-align:center;"><br><button id="insert_into_post" class="btn image">Insert into Post</button></td></tr></tbody>';
								}
								else if(type == 'doc'){
									var content='<tbody><tr><td valign="top"><strong>File name : </strong><span>'+$(target).attr('data-filename_org')+'</span><br><strong>Kind : </strong><span>Document</span><br><table border="0" id="renditions"><tr><td>&nbsp;</td><td ><div><input type="radio" checked="checked" name="radio_path" class="radio_path radio" value="'+$(target).attr('data-local_url_org')+'" id="radio_path" data-height="'+$(target).attr('data-height')+'" data-width="'+$(target).attr('data-width')+'"><label for="doc-path-orig" class="form_labels">Original</label></div></td></tr></table></td></tr><tr><td><strong>Link Text:</strong></td><td><input type="text" value="" id="doc_link_text"></td></tr><tr><td>&nbsp;</td><td><br><button type="button" id="insert_into_post" class="btn document">Insert into Post</button></td></tr></tbody>';
								}
								else if(type == 'vid'){
									var content='<tbody><tr><td valign="top"><strong>File name : </strong><span>'+$(target).attr('data-filename_org')+'</span><br><strong>Kind : </strong><span>Video</span><br><table border="0" id="renditions"><tr><td>&nbsp;</td><td ><div class="image-size-item"><input type="radio" checked="checked" name="radio_path" class="image-size-original radio" value="'+$(target).attr('data-local_url_org')+'" id="radio_path" data-height="'+$(target).attr('data-height')+'" data-width="'+$(target).attr('data-width')+'" data-image-thumb="'+$(target).attr('data-local_url_thumb')+'"><label for="radio_path_orig" class="form_labels">Original</label></div></td></tr></table></td></tr><tr><td><strong>Width:</strong></td><td><input type="text" id="width" value="'+$(target).attr('data-width').toString().split(".")[0]+'" class="width"></td></tr><tr><td><strong>Height:</strong></td><td><input type="text" value="'+$(target).attr('data-height').toString().split(".")[0]+'" class="height" id="height"></td></tr><tr><td>&nbsp;</td><td><br><button type="button" data-id="'+$(target).attr('id')+'" id="insert_into_post" class="btn video">Insert into Post</button></td></tr></tbody>';
								}
								$('.describe').html(content);
								$('.rend').remove();
								for(x=1; x<=$(target).attr('rend_total'); x++){
									$('#renditions').append("<tr class='rend'><td><strong>&nbsp;</strong></td><td><div class='image-size-item'><input type='radio' name='radio_path' class='image-size-rend radio' value='"+$(target).attr('rend_local_url_org'+x)+"' id='radio_path' data-height='"+$(target).attr('rend_height'+x)+"' data-width='"+$(target).attr('rend_width'+x)+"' data-image-thumb='"+$(target).attr('data-local_url_thumb')+"'><label for='image-size-renditions' class='form_labels'>"+$(target).attr('rend_extension'+x).toUpperCase()+' ('+ parseInt($(target).attr('rend_width'+x))+'px X '+parseInt($(target).attr('rend_height'+x))+'px)'+"</label></div></td></tr>");
								}
								$('#razunaModalWindow').before($('#razunaImageDetails').html());
								$('#inner-div').addClass('inner-div');
		                        return false;
		                    }
		                }
		            }
		       },
			   "search" : {
					"case_insensitive" : true,
					"show_only_matches": true
				},
			"json_data" : {
				"ajax" : {
					"url" : pluginFolder+'?razunaaction=ajax.getNodes',
					"data" : function (n) {
						return {
							"folderid" : n.attr ? n.attr("id") : 0
						};
					}
				}
			}
		});
		$('#razunaModalWindow').before($('#search_div'));
		}).dialog('open');
	}
}