<img data-ui-avatar class="sk-msg-avatar">
<div class="sk-msg-wrapper">
    <div data-ui-name class="sk-from"></div>
    <div class="sk-msg">
        <span data-ui-message></span>
        <% _(actions).each(function(action) { %>
            <div class="sk-action">
                <a class="btn btn-sk-primary" href="<%= action.uri %>"  target="_blank"><%= action.text %></a>
            </div>
        <% }) %>
    </div>
</div>
<div class="sk-clear"></div>

