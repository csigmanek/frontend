declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent
  export default component
}
declare module 'element-plus' {
 export default PluginInstallFunction
}
declare module '@tensorflow/tf-vis' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  export = <any> {};
}
