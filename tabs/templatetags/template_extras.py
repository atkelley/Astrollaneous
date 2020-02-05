from django import template

register = template.Library()

# {{ value|filter_name:"arg" }}
# techport_data.projects.projects|next:forloop.counter0 as next

@register.filter
def bookends(list, index):
    try:
        bookends = {}
        if index == 0:
            bookends['previous'] = {'id': 0}
            bookends['next'] = list[int(index)+1]
        elif index == len(list)-1:
            bookends['previous'] = list[int(index)-1]
            bookends['next'] = {'id': 0}
        else:
            bookends['previous'] = list[int(index)-1]
            bookends['next'] = list[int(index)+1]
        return bookends
    except:
        return None
