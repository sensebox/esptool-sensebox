export default function EspWebFlasherLoader() {
  useEffect(() => {
    window.esptoolPackage = import(
      'https://unpkg.com/esp-web-flasher@5.1.4/dist/web/index.js?module'
    )
  }, [])
  return null
}
