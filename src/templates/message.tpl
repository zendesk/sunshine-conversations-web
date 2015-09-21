<img data-ui-avatar class="sk-msg-avatar">
<div class="sk-msg-wrapper">
    <div data-ui-name class="sk-from"></div>
    <div class="sk-msg">
        <span data-ui-message></span>
        <% if (actions) { %>
            <% for(var index in actions) { %>
                <% var action = actions[index]; %>
                <div class="sk-action">
                    <a class="btn btn-sk-primary" href="<%= action.uri %>"  target="_blank"><%= action.text %></a>
                </div>
            <% } %>
        <% } %>
    </div>
</div>
<div class="sk-clear"></div>

