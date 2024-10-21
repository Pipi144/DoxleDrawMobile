import {StyleSheet} from 'react-native';
import {usePhotoAnnotationContext} from '../PhotoAnnotation';
import {produce} from 'immer';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

const useAnnotateTopMenu = () => {
  const {
    setAddedMarkup,
    addedMarkup,
    oldMarkup,
    setOldMarkup,
    tool,
    setTool,
    setCurrentColorForTool,
    handleClosePhotoAnnotationModal,
  } = usePhotoAnnotationContext();
  const {THEME_COLOR} = useDOXLETheme();

  const handleUndo = () => {
    if (oldMarkup && addedMarkup.length === 0)
      setOldMarkup(
        produce(draft => {
          draft?.pop();
        }),
      );
    else
      setAddedMarkup(
        produce(draft => {
          draft.pop();
        }),
      );
  };

  const handlePressPencil = () => {
    setTool(prev => (prev === 'Pencil' ? 'Pointer' : 'Pencil'));
    setCurrentColorForTool(THEME_COLOR.doxleColor);
  };
  const handlePressCircle = () => {
    setTool(prev => (prev === 'Circle' ? 'Pointer' : 'Circle'));
    setCurrentColorForTool(THEME_COLOR.doxleColor);
  };
  const handlePressRectangle = () => {
    setTool(prev => (prev === 'Rectangle' ? 'Pointer' : 'Rectangle'));
    setCurrentColorForTool(THEME_COLOR.doxleColor);
  };
  const handlePressTextTool = () => {
    setTool(prev => (prev === 'Text' ? 'Pointer' : 'Text'));
    setCurrentColorForTool(THEME_COLOR.doxleColor);
  };
  const handleCloseBtn = () => {
    if (tool === 'Pointer') handleClosePhotoAnnotationModal();
    else {
      setTool('Pointer');
    }
  };
  const shouldShowColorPicker = tool !== 'Pointer';

  const shouldShowPencilTool = tool === 'Pencil' || tool === 'Pointer';
  const shouldShowCircleTool = tool === 'Circle' || tool === 'Pointer';
  const shouldShowRectangleTool = tool === 'Rectangle' || tool === 'Pointer';
  const shouldShowTextTool = tool === 'Pointer';
  const shouldShowUndo = addedMarkup.length > 0 || oldMarkup !== undefined;
  return {
    shouldShowUndo,
    handleUndo,
    shouldShowColorPicker,
    handlePressPencil,

    shouldShowPencilTool,
    shouldShowCircleTool,
    shouldShowRectangleTool,
    handlePressCircle,
    handlePressRectangle,
    handleCloseBtn,
    shouldShowTextTool,
    handlePressTextTool,
  };
};

export default useAnnotateTopMenu;
