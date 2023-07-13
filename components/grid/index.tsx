import clsx from 'clsx';

function Grid(props: React.ComponentProps<'ul'>) {
  return (
    <ul {...props} className={clsx('grid', props.className)}>
      {props.children}
    </ul>
  );
}

function GridItem(props: React.ComponentProps<'li'>) {
  return (
    <li
      {...props}
      className={clsx(
        'relative h-full w-full overflow-hidden bg-white transition-opacity',
        props.className
      )}
    >
      {props.children}
    </li>
  );
}

Grid.Item = GridItem;
export default Grid;
