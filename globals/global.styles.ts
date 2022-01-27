export default {
  get colors() {
    const colors = {
      black: 'black',
      blue: '#247AD5',
      green: '#0CAB60',
      grey: '#6A6264',
      orange: '#E88C3C',
      red: '#F24236',
      white: 'white',
    }
    return {
      ...colors,
      primary: colors.green,
      secondary: colors.blue,
    }
  },
  maxWidth: '1600px',
}
