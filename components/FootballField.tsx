import React, { useState, useEffect } from 'react';

interface FootballFieldProps {
  children?: React.ReactNode;
}
  
const FootballField: React.FC<FootballFieldProps> = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState<boolean>(true);

  // Update orientation based on screen dimensions
  useEffect(() => {
    const handleResize = () => {
      const shouldBeLandscape = window.innerWidth > window.innerHeight;
      if (shouldBeLandscape !== isLandscape) {
        setIsLandscape(shouldBeLandscape);
      }
    };
    
    // Set initial orientation
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate yard lines and numbers
  const renderYardLines = () => {
    const lines = [];
    // 11 main lines (0, 10, 20, 30, 40, 50, 40, 30, 20, 10, 0)
    const totalMainLines = 11;
    
    for (let i = 0; i < totalMainLines; i++) {
      const position = `${(i / (totalMainLines - 1)) * 90 + 5}%`; // 5% offset for end zones
      const yardNumber = i === 0 || i === 10 ? '' :
                        i === 1 || i === 9 ? '10' :
                        i === 2 || i === 8 ? '20' :
                        i === 3 || i === 7 ? '30' :
                        i === 4 || i === 6 ? '40' :
                        '50';
      
      // Add main yard line
      const lineClass = isLandscape ? `absolute bg-white w-0.5 h-full top-0` : `absolute bg-white w-full h-0.5 left-0`;
      const lineStyle = isLandscape 
        ? { left: position } 
        : { top: position };

      lines.push(<div key={`main-line-${i}`} className={lineClass} style={lineStyle} />);

      // Add yard numbers on the sides
      if (yardNumber) {
        if (isLandscape) {
          // Top number
          lines.push(
            <div 
              key={`number-top-${i}`}
              className="absolute top-[5%] text-white font-bold text-xl -translate-x-1/2"
              style={{ left: position }}
            >
              {yardNumber}
            </div>
          );
          
          // Bottom number
          lines.push(
            <div 
              key={`number-bottom-${i}`} 
              className="absolute bottom-[5%] text-white font-bold text-xl -translate-x-1/2"
              style={{ left: position }}
            >
              {yardNumber}
            </div>
          );
        } else {
          // Left number
          lines.push(
            <div 
              key={`number-left-${i}`} 
              className="absolute left-[5%] text-white font-bold text-xl -translate-y-1/2"
              style={{ top: position }}
            >
              {yardNumber}
            </div>
          );
          
          // Right number
          lines.push(
            <div
              key={`number-right-${i}`} 
              className="absolute right-[5%] text-white font-bold text-xl -translate-y-1/2"
              style={{ top: position }}
            >
              {yardNumber}
            </div>
          );
        }
      }
      
      // Add 5-yard lines between main yard lines (except at end zones)
      if (i < totalMainLines - 1) {
        const halfwayPosition = `${((i + 0.5) / (totalMainLines - 1)) * 90 + 5}%`;
        const halfwayLineClass = isLandscape ? `absolute bg-white w-[1px] h-full top-0` : `absolute bg-white w-full h-[1px] left-0`;
        const halfwayLineStyle = isLandscape 
          ? { left: halfwayPosition } 
          : { top: halfwayPosition };
        
        lines.push(<div key={`half-line-${i}`}  className={halfwayLineClass} style={halfwayLineStyle} />);
      }
    }
    
    return lines;
  };

  // Generate hash marks correctly along the field
  const renderHashMarks = () => {
    const hashMarks = [];
    
    // Hash marks appear at every yard on the field (not just 5 and 10 yard lines)
    // NFL hashmarks are positioned 70' 9" from each sideline (about 1/3 of the field width)
    for (let i = 0; i <= 100; i++) {
      // Skip 0 and 100 yard marks (they're in the end zone)
      if (i === 0 || i === 100) continue;
      
      const position = `${(i / 100) * 90 + 5}%`; // 5% offset for end zones
      
      if (isLandscape) {
        // Hash marks at 1/3 from top
        hashMarks.push(
          <div 
            key={`hash-top-${i}`} 
            className="absolute w-0.5 h-[1.5vh] bg-white top-1/3 -translate-x-1/2"
            style={{ left: position }}
          />
        );
        
        // Hash marks at 1/3 from bottom
        hashMarks.push(
          <div 
            key={`hash-bottom-${i}`} 
            className="absolute w-0.5 h-[1.5vh] bg-white bottom-1/3 -translate-x-1/2"
            style={{ left: position }}
          />
        );
      } else {
        // Hash marks at 1/3 from left
        hashMarks.push(
          <div 
            key={`hash-left-${i}`} 
            className="absolute w-[1.5vw] h-0.5 bg-white left-1/3 -translate-y-1/2"
            style={{ top: position }}
          />
        );
        
        // Hash marks at 1/3 from right
        hashMarks.push(
          <div 
            key={`hash-right-${i}`}
            className="absolute w-[1.5vw] h-0.5 bg-white right-1/3 -translate-y-1/2"
            style={{ top: position }}
          />
        );
      }
    }
    
    return hashMarks;
  };

  // Generate end zones
  const renderEndZones = () => {
    if (isLandscape) {
      return (
        <>
          {/* Left end zone */}
          <div className='absolute w-[5%] h-full bg-red-600 top-0 left-0 flex justify-center items-center'>
            <div className='text-white bold whitespace-nowrap -rotate-90 text-[2.5vh]'>
              END ZONE
            </div>
          </div>
          
          {/* Right end zone */}
          <div className='absolute w-[5%] h-full bg-red-600 top-0 right-0 flex justify-center items-center' >
            <div className='text-white bold whitespace-nowrap rotate-90 text-[2.5vh]'>
              END ZONE
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          {/* Top end zone */}
          <div 
            className="absolute top-0 left-0 h-[5%] w-full bg-red-600 flex justify-center items-center"
          >
            <div className="text-white text-[2.5vw] font-bold">
              END ZONE
            </div>
          </div>
          
          {/* Bottom end zone */}
          <div 
            className="absolute bottom-0 left-0 h-[5%] w-full bg-red-600 flex justify-center items-center"
          >
            <div className="text-white text-[2.5vw] font-bold">
              END ZONE
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div
      className='w-full h-full absolute top-0 left-0 bg-green-800 overflow-hidden'>
      {/* Render field elements */}
      {renderEndZones()}
      {renderYardLines()}
      {renderHashMarks()}
      
      {/* Midfield logo */}
      <div
        className='absolute rounded-full bg-white/10 border-2 border-white/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-white font-bold'
        style={{
          width: isLandscape ? '25vh' : '25vw',
          height: isLandscape ? '25vh' : '25vw',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FootballField;
