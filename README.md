# Krateo helm values validator action

This action checks if all the properties in the values.yaml are used and if some files in templates folder has missing value.

## Inputs

### `chart-folder`

The folder of the helm chart. Default `"./chart"`.

### `stop-if-find-orphans`

Stop the action if found some orphan. Default `"true"`.

### `stop-on-error`

Stop the action in case of error. Default `"true"`.

## Example usage

```yaml
uses: actions/helm-values-validator-action@v0.1
```

```yaml
uses: actions/helm-values-validator-action@v0.1
with:
  chart-folder: './chart'
```
