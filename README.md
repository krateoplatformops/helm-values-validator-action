# Krateo helm values validator action

This action checks if all the properties in the values.yaml are used and if some files in templates folder has missing value.

## Inputs

### `chart-folder`

The folder of the helm chart. Default `"./chart"`.

### `stop-if-find-orphans`

Stop the action if found some orphan. Default `"true"`.

### `stop-on-error`

Stop the action in case of error. Default `"true"`.

### `ignore`

List of property to be ignored. Default `""`. String of properties separated by comma. For nested properties use dot notation.

## Example usage

```yaml
uses: krateoplatformops/helm-values-validator-action@1.0.2
```

or with params:

```yaml
uses: krateoplatformops/helm-values-validator-action@1.0.5
with:
  chart-folder: './chart'
  stop-if-find-orphans: true
  stop-on-error: true
  ignore: 'labels,metadata.annotations'
```
