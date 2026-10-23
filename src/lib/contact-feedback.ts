export type ContactFieldRules={minLength:number;maxLength:number;emailInvalid?:boolean};
export function contactFieldError(value:string,rules:ContactFieldRules,en:boolean){
 if(!value.trim())return en?'Please fill in this field.':'Kolom ini perlu diisi.';
 if(rules.emailInvalid)return en?'Enter a valid email address.':'Masukkan alamat email yang valid.';
 if(value.trim().length<rules.minLength)return en?`Use at least ${rules.minLength} characters.`:`Gunakan minimal ${rules.minLength} karakter.`;
 if(rules.maxLength>0&&value.length>rules.maxLength)return en?`Use no more than ${rules.maxLength} characters.`:`Gunakan maksimal ${rules.maxLength} karakter.`;
 return '';
}
