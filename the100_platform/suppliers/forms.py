from django import forms
from .models import Supplier

class SupplierForm(forms.ModelForm):
    class Meta:
        model = Supplier
        fields = ['name', 'address','description', 'status']

class SupplierUpdateForm(forms.ModelForm):
    class Meta:
        model = Supplier
        fields = ['name', 'address','description', 'status']

    def clean_name(self):
        name = self.cleaned_data['name']
        if Supplier.objects.exclude(pk=self.instance.pk).filter(name=name).exists():
            raise forms.ValidationError("Tên nhà cung cấp đã tồn tại.")
        return name