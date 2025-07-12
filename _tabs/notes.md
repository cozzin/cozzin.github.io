---
layout: page
title: Notes
permalink: /notes/
icon: fas fa-sticky-note
order: 5
---

{% assign notes = site.notes | sort: 'date' | reverse %}
<ul>
  {% for note in notes %}
    <li>
      <a href="{{ note.url }}">{{ note.title }}</a> ({{ note.date | date: '%Y-%m-%d' }})
    </li>
  {% endfor %}
</ul> 