import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Path,
  Rect,
  SvgProps,
} from 'react-native-svg';

export const PhotoArrowTool = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}>
    <Rect width={50} height={50} fill="#fff" rx={25} />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.5 33.75 33.75 17.5m0 0v15.6m0-15.6h-15.6"
    />
  </Svg>
);

export const PhotoStraightLineTool = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}>
    <Rect width={50} height={50} fill="#fff" rx={25} />
    <Path
      fill="#000"
      d="M34.712 16.29a1.002 1.002 0 0 0-1.42 0l-18 18a1.001 1.001 0 0 0 .325 1.639 1 1 0 0 0 1.095-.22l18-18a1 1 0 0 0 0-1.42Z"
    />
  </Svg>
);

export const PhotoLabelTool = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}>
    <Rect width={50} height={50} fill="#fff" rx={25} />
    <Path
      fill="#000"
      d="M22.75 30.25a.75.75 0 0 1 .75-.75h.75v-9H20.5v.75a.75.75 0 1 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 1 1-1.5 0v-.75h-3.75v9h.75a.75.75 0 1 1 0 1.5h-3a.75.75 0 0 1-.75-.75Zm-8.25-10.5A3.75 3.75 0 0 1 18.25 16h13.5a3.75 3.75 0 0 1 3.75 3.75v10.5A3.75 3.75 0 0 1 31.75 34h-13.5a3.75 3.75 0 0 1-3.75-3.75v-10.5Zm3.75-2.25A2.25 2.25 0 0 0 16 19.75v10.5a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 34 30.25v-10.5a2.25 2.25 0 0 0-2.25-2.25h-13.5Z"
    />
  </Svg>
);

export const PhotoRectangleTool = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}>
    <Rect width={50} height={50} fill="#fff" rx={25} />
    <Path
      fill="#000"
      d="M35.313 14.219H14.686a2.344 2.344 0 0 0-2.343 2.344v16.875a2.344 2.344 0 0 0 2.344 2.343h20.624a2.344 2.344 0 0 0 2.344-2.343V16.561a2.344 2.344 0 0 0-2.343-2.343Zm-.47 18.75H15.157V17.03h19.688V32.97Z"
    />
  </Svg>
);

export const PhotoCircleTool = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}>
    <Rect width={50} height={50} fill="#fff" rx={25} />
    <Path
      stroke="#000"
      strokeWidth={2}
      d="M25 35c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
    />
  </Svg>
);

export const PhotoUndoIcon = (props: {isDisabled: boolean}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}>
    <Rect
      width={50}
      height={50}
      fill={props.isDisabled ? 'grey' : 'white'}
      rx={25}
    />
    <G clipPath="url(#a)">
      <Path
        fill="#000"
        d="M37 25c0 1.625-.318 3.177-.953 4.656-.636 1.48-1.49 2.755-2.563 3.828-1.073 1.073-2.349 1.927-3.828 2.563-1.479.635-3.031.953-4.656.953-1.792 0-3.495-.378-5.11-1.133a11.73 11.73 0 0 1-4.124-3.195.558.558 0 0 1-.102-.352.46.46 0 0 1 .133-.32l2.14-2.156a.562.562 0 0 1 .391-.14c.167.02.287.082.36.187a7.843 7.843 0 0 0 2.796 2.297A7.878 7.878 0 0 0 25 33c1.083 0 2.117-.21 3.102-.633a8.06 8.06 0 0 0 2.554-1.71 8.06 8.06 0 0 0 1.711-2.555A7.792 7.792 0 0 0 33 25c0-1.083-.21-2.117-.633-3.102a8.06 8.06 0 0 0-1.71-2.554 8.06 8.06 0 0 0-2.555-1.711A7.792 7.792 0 0 0 25 17c-1.02 0-2 .185-2.938.555-.937.37-1.77.898-2.5 1.586l2.141 2.156c.323.312.396.672.219 1.078-.177.417-.485.625-.922.625h-7a.961.961 0 0 1-.703-.297A.961.961 0 0 1 13 22v-7c0-.438.208-.745.625-.922.406-.177.766-.104 1.078.219l2.031 2.015a12.128 12.128 0 0 1 3.82-2.445A11.771 11.771 0 0 1 25 13c1.625 0 3.177.318 4.656.953 1.48.636 2.755 1.49 3.828 2.563 1.073 1.073 1.927 2.349 2.563 3.828.635 1.479.953 3.031.953 4.656Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M13 13h24v24H13z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export const PhotoBlueSelection = (props: any) => (
  <Svg
    width={15}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={15} height={15} rx={3} fill="#216BFF" />
  </Svg>
);

export const PhotoOrangeSelection = (props: any) => (
  <Svg
    width={15}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={15} height={15} rx={3} fill="#FF7C04" />
  </Svg>
);

export const PhotoRedSelection = (props: any) => (
  <Svg
    width={15}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={15} height={15} rx={3} fill="#F22" />
  </Svg>
);

export const PhotoGreenSelection = (props: any) => (
  <Svg
    width={15}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={15} height={15} rx={3} fill="#27BF36" />
  </Svg>
);

export const PhotoPurpleSelection = (props: any) => (
  <Svg
    width={15}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={15} height={15} rx={3} fill="#5A36BE" />
  </Svg>
);

export const PhotoYellowSelection = (props: any) => (
  <Svg
    width={15}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={15} height={15} rx={3} fill="#FFBA35" />
  </Svg>
);
export const CameraCloseIcon = (props: any) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M23.2897 4.0987C24.2268 3.16164 24.2268 1.63986 23.2897 0.702795C22.3526 -0.234265 20.8309 -0.234265 19.8938 0.702795L12 8.60409L4.0987 0.710292C3.16164 -0.226769 1.63986 -0.226769 0.702795 0.710292C-0.234265 1.64735 -0.234265 3.16914 0.702795 4.1062L8.60409 12L0.710292 19.9013C-0.226769 20.8384 -0.226769 22.3601 0.710292 23.2972C1.64735 24.2343 3.16914 24.2343 4.1062 23.2972L12 15.3959L19.9013 23.2897C20.8384 24.2268 22.3601 24.2268 23.2972 23.2897C24.2343 22.3526 24.2343 20.8309 23.2972 19.8938L15.3959 12L23.2897 4.0987Z"
      fill="white"
    />
  </Svg>
);

export const ClearAnnotationIcon = (props: {isDisabled: boolean}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}>
    <Rect
      width={50}
      height={50}
      fill={props.isDisabled ? 'grey' : '#fff'}
      rx={25}
    />
    <Path
      stroke="#000"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m35.39 25.085-6.432-8.535-8.892 6.7 6.683 8.25 1.678-1.168 6.963-5.247Z"
    />
    <Path
      stroke="#000"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m26.749 31.5-1.92 1.537h-5.281l-1.3-1.725-3.217-4.268 5.218-3.932"
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={2}
      d="M19.602 33.036h15.68"
    />
  </Svg>
);
