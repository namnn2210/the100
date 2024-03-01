from django import forms
from .models import Category

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'status']

class CategoryUpdateForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'status']

    def clean_name(self):
        name = self.cleaned_data['name']
        if Category.objects.exclude(pk=self.instance.pk).filter(name=name).exists():
            raise forms.ValidationError("A category with this name already exists.")
        return name