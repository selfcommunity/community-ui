import type { Meta, StoryObj } from '@storybook/react';
import ScrollContainer from './index';

export default {
  title: 'Design System/React UI Shared/ScrollContainer',
  component: ScrollContainer
} as Meta<typeof ScrollContainer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const template = (args) => (
  <div style={{height: 500, width: 300}}>
    <ScrollContainer {...args}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam augue vel pellentesque tristique. Cras eget accumsan quam, ac commodo
        arcu. Vestibulum porta elementum libero non euismod. Vivamus bibendum egestas ipsum. Morbi euismod erat ac risus convallis placerat. Integer
        feugiat, purus at scelerisque dapibus, justo urna eleifend tellus, in pulvinar risus sapien nec ante. Nullam blandit ex sit amet nibh pretium,
        ut ullamcorper mauris semper. In semper nisi non dapibus vehicula. Integer aliquet urna sit amet consequat ullamcorper. Vivamus ornare lectus
        sed lorem venenatis, a faucibus nulla bibendum. Phasellus quis dui hendrerit, sodales mauris vel, vehicula urna. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit.
      </p>
      <p>
        Fusce sit amet nisi ultricies, varius magna semper, semper mi. Ut faucibus, dolor non rutrum dictum, ipsum urna aliquam augue, non egestas
        odio mi vitae purus. Etiam volutpat ut magna ut tristique. Vivamus a tempor ex, eu egestas lorem. Nullam pulvinar, sem sit amet scelerisque
        porttitor, metus elit eleifend libero, vel tincidunt nibh nisi sed eros. Ut quis quam ut nulla commodo commodo. Morbi ac felis id ligula
        maximus iaculis. Nunc malesuada placerat purus eget consequat.
      </p>
      <p>
        Aenean non volutpat metus. Integer vestibulum eleifend libero, in fringilla tellus varius nec. Suspendisse
        ultrices quam ut lacus faucibus, quis sollicitudin dolor molestie. Fusce cursus eget tortor a pharetra. Nunc non tincidunt sapien. In faucibus
        magna ut congue semper. Sed facilisis suscipit ultricies. Nam fermentum, odio in porta blandit, arcu lorem blandit sem, id fermentum nunc
        velit euismod felis. Vivamus sodales velit in felis tempus sagittis. Etiam id purus venenatis sem tempor dictum. In efficitur odio ipsum, ac
        mattis enim gravida vel. Fusce ut neque efficitur, pulvinar justo et, ornare purus. Nulla molestie mollis nulla sed imperdiet. Vestibulum eget
        sapien eros. Morbi sed erat in magna viverra condimentum vitae quis purus. Morbi vitae gravida dui.
      </p>
      <p>
        In hac habitasse platea dictumst. Quisque ullamcorper turpis ultrices posuere feugiat. Etiam vehicula orci ac ipsum tincidunt, non ornare leo
        tristique. Nullam eleifend massa mollis elit consectetur fermentum. In congue efficitur odio, nec imperdiet elit volutpat sed. Mauris congue
        ut mauris non semper. Duis ultrices elit mauris, eu mollis lacus ullamcorper et. Donec vel libero enim. Sed placerat felis lectus, sit amet
        posuere libero laoreet sed. Integer vitae luctus magna. Phasellus et diam ipsum. Vestibulum tempor dictum ante, quis varius dolor mattis non.
        Aliquam tempus, dolor dignissim posuere tincidunt, leo massa pulvinar velit, nec sollicitudin arcu arcu ac nulla. Aenean ipsum felis, iaculis
        vel libero ac, tincidunt molestie elit. Aliquam eu nunc nunc. Integer at ante a erat tincidunt imperdiet. Morbi augue magna, fermentum id
        posuere ultrices, venenatis a tortor. Donec vel erat quis nisi vehicula cursus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Aliquam imperdiet lacinia nibh, ut semper erat vulputate sed. Phasellus mauris felis, ornare sit amet aliquam nec, maximus nec velit. Donec
        vel mollis magna, id feugiat leo. Nulla interdum interdum est, a maximus dui blandit in. Maecenas et lacus ac justo placerat imperdiet. Cras
        sit amet sapien ac mi faucibus dignissim id eu libero. Donec porttitor interdum dui quis iaculis. Quisque odio massa, rhoncus sit amet nisl
        luctus, dictum finibus velit. Sed eu est ac nunc luctus viverra. Nunc placerat scelerisque hendrerit. Sed malesuada mauris orci, convallis
        gravida felis tempus ut. Sed porttitor risus vel ligula volutpat egestas dictum ut lectus. Cras mattis posuere tellus, egestas egestas orci
        accumsan et. Sed varius, risus eleifend scelerisque lobortis, ante ligula rutrum tellus, a fermentum libero nulla id nisl. Nulla eros elit,
        convallis in justo quis, fermentum molestie leo. Pellentesque pulvinar tortor sit amet gravida euismod. Etiam id scelerisque ligula. Donec eu
        dui at leo placerat facilisis quis quis dui. Donec aliquam lacinia lacus, vitae dictum velit vulputate eu.
      </p>
    </ScrollContainer>
  </div>
);

export const Base: StoryObj<typeof ScrollContainer> = {
  render: template
};
