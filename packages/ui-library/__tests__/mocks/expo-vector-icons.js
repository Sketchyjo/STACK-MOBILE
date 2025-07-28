// Mock for @expo/vector-icons
const React = require('react');

const createMockComponent = (name) => {
  const MockComponent = (props) => {
    return React.createElement('Text', {
      ...props,
      testID: props.testID || `${name}-icon`,
      children: props.name || '📱', // Default icon
    });
  };
  MockComponent.displayName = name;
  return MockComponent;
};

const Ionicons = createMockComponent('Ionicons');
const MaterialIcons = createMockComponent('MaterialIcons');
const FontAwesome = createMockComponent('FontAwesome');
const AntDesign = createMockComponent('AntDesign');
const Entypo = createMockComponent('Entypo');
const EvilIcons = createMockComponent('EvilIcons');
const Feather = createMockComponent('Feather');
const FontAwesome5 = createMockComponent('FontAwesome5');
const Foundation = createMockComponent('Foundation');
const MaterialCommunityIcons = createMockComponent('MaterialCommunityIcons');
const Octicons = createMockComponent('Octicons');
const SimpleLineIcons = createMockComponent('SimpleLineIcons');
const Zocial = createMockComponent('Zocial');

module.exports = {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome5,
  Foundation,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
  default: {
    Ionicons,
    MaterialIcons,
    FontAwesome,
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome5,
    Foundation,
    MaterialCommunityIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
  }
};